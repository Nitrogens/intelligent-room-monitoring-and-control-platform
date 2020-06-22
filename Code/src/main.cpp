#include <stdio.h>
#include <time.h>
#include <Arduino.h>
#include <Arduino_FreeRTOS.h>
#include <queue.h>
#include <semphr.h>
#include <SPI.h>
#include <TroykaDHT.h>
#include <EEPROM.h>
#include <ThreeWire.h>  
#include <RtcDS1302.h>

#define ADDR_SMOKE_THRESHOLD 1
#define ADDR_LED_WORKMODE 2

#define PIN_LDR     PIN_A1
#define PIN_SMOKE   PIN_A2
#define PIN_SOUNDER 2
#define PIN_DHT     6
#define TYPE_DHT    DHT22

#define countof(a) (sizeof(a) / sizeof(a[0]))

static int led[] = {15, 16, 17};

static DHT dht(PIN_DHT, TYPE_DHT);
ThreeWire myWire(9, 8, 7); // IO, SCLK, CE
RtcDS1302<ThreeWire> Rtc(myWire);

QueueHandle_t Queue_SendData;

SemaphoreHandle_t Mutex_CurrentSmokeThreshold;
SemaphoreHandle_t Mutex_SmokeAlert;
SemaphoreHandle_t Mutex_LEDWorkMode;
SemaphoreHandle_t Mutex_Serial;

TaskHandle_t Task_LightIntensityData;
TaskHandle_t Task_SmokeData;
TaskHandle_t Task_THData;
TaskHandle_t Task_SendData;
TaskHandle_t Task_GetData;

enum DataToServerTaskType {
    LightIntensity,
    Smoke,
    TempratureAndHumidity,
};

enum DataFromServerTaskType {
    LED,
    SmokeThreshold,
};

struct DataToServer {
    DataToServerTaskType type;
    float value1, value2;
};

struct DataFromServer {
    DataFromServerTaskType type;
    int id, value;
};

void TaskLightIntensityData(void *pvParameters);
void TaskSmokeData(void *pvParameters);
void TaskTHData(void *pvParameters);
void TaskSendData(void *pvParameters);
void TaskGetData(void *pvParameters);

int GetSmokeThreshold();
void SetSmokeThreshold(int value);
void SmokeAlert(bool);
void SetLEDWorkMode(int id, int value);
void printDateTime(const RtcDateTime& dt);


void setup() {
    Serial.begin(9600);
    Rtc.Begin();
    dht.begin();

    pinMode(PIN_SOUNDER, OUTPUT);
    for (int i = 0; i < 3; i++) {
        pinMode(led[i], OUTPUT);
    }

    Queue_SendData = xQueueCreate(5, sizeof(DataToServer));

    Mutex_CurrentSmokeThreshold = xSemaphoreCreateMutex();
    Mutex_LEDWorkMode = xSemaphoreCreateMutex();
    Mutex_SmokeAlert = xSemaphoreCreateMutex();
    Mutex_Serial = xSemaphoreCreateMutex();
    xSemaphoreGive(Mutex_CurrentSmokeThreshold);
    xSemaphoreGive(Mutex_LEDWorkMode);
    xSemaphoreGive(Mutex_SmokeAlert);
    xSemaphoreGive(Mutex_Serial);

    xTaskCreate(TaskLightIntensityData, 
                "LightIntensityData", 
                128, 
                NULL, 
                1,
                &Task_LightIntensityData);
    xTaskCreate(TaskSmokeData, 
                "SmokeData", 
                128, 
                NULL, 
                1,
                &Task_SmokeData);
    xTaskCreate(TaskTHData, 
                "THData", 
                128, 
                NULL, 
                1, 
                &Task_THData);
    xTaskCreate(TaskSendData, 
                "SendData", 
                192, 
                NULL, 
                2, 
                &Task_SendData);
    // Serial.println("5");
    // xTaskCreate(TaskGetData, 
    //             "GetData", 
    //             64, 
    //             NULL, 
    //             2, 
    //             &Task_GetData);
    // Serial.println("6");
    vTaskStartScheduler();
}

void loop() {
    // put your main code here, to run repeatedly:
}

int GetSmokeThreshold() {
    // xSemaphoreTake(Mutex_Serial, portMAX_DELAY);
    // Serial.println("GetSmokeThreshold");
    // xSemaphoreGive(Mutex_Serial);
    xSemaphoreTake(Mutex_CurrentSmokeThreshold, portMAX_DELAY);
    //int data = (int)EEPROM.read(ADDR_SMOKE_THRESHOLD);
    int data = 100;
    xSemaphoreGive(Mutex_CurrentSmokeThreshold);
    return data;
}

void SetSmokeThreshold(int value) {
    //Serial.println("SetSmokeThreshold");
    xSemaphoreTake(Mutex_CurrentSmokeThreshold, portMAX_DELAY);
    //EEPROM.write(ADDR_SMOKE_THRESHOLD, value);
    xSemaphoreGive(Mutex_CurrentSmokeThreshold);
}

void SmokeAlert(bool isOn) {
    //Serial.println("SmokeAlert");
    xSemaphoreTake(Mutex_SmokeAlert, portMAX_DELAY);
    if (isOn) {
        analogWrite(PIN_SOUNDER, 255 / 2);
    } else {
        analogWrite(PIN_SOUNDER, 0);
    }
    xSemaphoreGive(Mutex_SmokeAlert);
}

void SetLEDWorkMode(int id, int value) {
    //Serial.println("SetLEDWorkMode");
    xSemaphoreTake(Mutex_CurrentSmokeThreshold, portMAX_DELAY);
    //EEPROM.write(ADDR_LED_WORKMODE + id, value);
    switch (value) {
    case 0:
    case 1:
        digitalWrite(led[id], value);
        break;
    }
    xSemaphoreGive(Mutex_CurrentSmokeThreshold);
}

void printDateTime(const RtcDateTime& dt)
{
    char datestring[20];
    
    snprintf_P(datestring, 
            countof(datestring),
            PSTR("%04u/%02u/%02u %02u:%02u:%02u"),
            dt.Year(),
            dt.Month(),
            dt.Day(),
            dt.Hour(),
            dt.Minute(),
            dt.Second() );
    Serial.print(datestring);
}


float voltage;

void TaskLightIntensityData(void *pvParameters) {
    for (;;) {
        xSemaphoreTake(Mutex_Serial, portMAX_DELAY);
        //Serial.println("Light");
        xSemaphoreGive(Mutex_Serial);
        voltage = analogRead(PIN_LDR);
        DataToServer data = (DataToServer){LightIntensity, (float)voltage, 0.0};
        xQueueSend(Queue_SendData, &data, portMAX_DELAY);;
        // TODO: 根据光强调节 LED 灯的发光强度
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
}

int smokeData, smokeThreshold;

void TaskSmokeData(void *pvParameters) {
    for (;;) {
        xSemaphoreTake(Mutex_Serial, portMAX_DELAY);
        //Serial.println("Smoke");
        xSemaphoreGive(Mutex_Serial);
        smokeData = analogRead(PIN_SMOKE);
        smokeThreshold = GetSmokeThreshold();
        DataToServer data = (DataToServer){Smoke, (float)smokeData, (float)smokeThreshold};
        xQueueSend(Queue_SendData, &data, portMAX_DELAY);
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}

void TaskTHData(void *pvParameters) {
    for (;;) {
        vTaskSuspendAll();
        dht.read();
        float h = dht.getHumidity();
        float t = dht.getTemperatureC();
        xTaskResumeAll();
        DataToServer data = (DataToServer){TempratureAndHumidity, t, h};
        xQueueSend(Queue_SendData, &data, portMAX_DELAY);
        vTaskDelay(2000 / portTICK_PERIOD_MS);
    }
}

DataToServer dataToServer;

void TaskSendData(void *pvParameters) {
    for (;;) {
        //Serial.println("SendData");
        if (xQueueReceive(Queue_SendData, &dataToServer, portMAX_DELAY) == pdPASS) {
            xSemaphoreTake(Mutex_Serial, portMAX_DELAY);
            //Serial.println("Get!");
            Serial.print(dataToServer.type);
            Serial.print(" ");
            Serial.print(dataToServer.value1);
            Serial.print(" ");
            Serial.print(dataToServer.value2);
            Serial.print(" ");
            printDateTime(Rtc.GetDateTime());
            Serial.println();
            xSemaphoreGive(Mutex_Serial);
        }
        vTaskDelay((1000) / portTICK_PERIOD_MS);
    }
}

String strRead;
DataFromServer dataFromServer;

void TaskGetData(void *pvParameters) {
    for (;;) {
        if (Serial.available() > 0) {
            //Serial.println("TaskGetData");
            strRead = Serial.readString();
            sscanf(strRead.c_str(), "%d%d%d", &dataFromServer.type, &dataFromServer.id, &dataFromServer.value);
            switch (dataFromServer.type) {
            case LED:
                SetLEDWorkMode(dataFromServer.id, dataFromServer.value);
                break;
            case SmokeThreshold:
                SetSmokeThreshold(dataFromServer.value);
                break;
            }
        }
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}