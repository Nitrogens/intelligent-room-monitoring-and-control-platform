#include <stdio.h>
#include <time.h>
#include <Arduino.h>
#include <Arduino_FreeRTOS.h>
#include <queue.h>
#include <semphr.h>
#include <SPI.h>
#include <EEPROM.h>
#include <ThreeWire.h>
#include <RtcDS1302.h>

#define ADDR_SMOKE_THRESHOLD    1
#define ADDR_LED_WORKMODE       15
#define ADDR_RGB_VALUE          7

#define PIN_LDR                 PIN_A1
#define PIN_SMOKE               PIN_A2
#define PIN_LM35                PIN_A4
#define PIN_SOUNDER             3
#define PIN_R                   11
#define PIN_G                   4
#define PIN_B                   2

#define countof(a) (sizeof(a) / sizeof(a[0]))

int led[] = {5, 10, 6};
int status[3];

ThreeWire myWire(9, 8, 7); // IO, SCLK, CE
RtcDS1302<ThreeWire> Rtc(myWire);

QueueHandle_t Queue_SendData;

SemaphoreHandle_t Mutex_CurrentSmokeThreshold;
SemaphoreHandle_t Mutex_SmokeAlert;
SemaphoreHandle_t Mutex_LEDWorkMode;
SemaphoreHandle_t Mutex_Serial;
SemaphoreHandle_t Mutex_Status;
SemaphoreHandle_t Mutex_RGB;

TaskHandle_t Task_LightIntensityData;
TaskHandle_t Task_SmokeData;
TaskHandle_t Task_StatusData;
TaskHandle_t Task_TemperatureData;
TaskHandle_t Task_SendData;
TaskHandle_t Task_GetData;

enum DataToServerTaskType {
    LightIntensity,
    Smoke,
    Temprature,
    LEDStatus,
    RGBStatus,
};

enum DataFromServerTaskType {
    LED,
    SmokeThreshold,
    RGB,
};

struct DataToServer {
    DataToServerTaskType type;
    float value1, value2, value3;
};

struct DataFromServer {
    DataFromServerTaskType type;
    int id, value, value2, value3;
};

void TaskLightIntensityData(void *pvParameters);
void TaskSmokeData(void *pvParameters);
void TaskStatusData(void *pvParameters);
void TaskTemperatureData(void *pvParameters);
void TaskSendData(void *pvParameters);
void TaskGetData(void *pvParameters);

int GetSmokeThreshold();
void SetSmokeThreshold(int value);
void SmokeAlert(bool);
int GetLEDWorkMode(int id);
void SetLEDWorkMode(int id, int value);
void SetRGBValue(int R, int G, int B);
int GetR();
int GetG();
int GetB();
void printDateTime(const RtcDateTime& dt);


void setup() {
    Serial.begin(9600);
    Rtc.Begin();

    pinMode(PIN_SOUNDER, OUTPUT);
    for (int i = 0; i < 3; i++) {
        pinMode(led[i], OUTPUT);
    }
    pinMode(PIN_R, OUTPUT);
    pinMode(PIN_G, OUTPUT);
    pinMode(PIN_B, OUTPUT);

    Queue_SendData = xQueueCreate(4, sizeof(DataToServer));

    Mutex_CurrentSmokeThreshold = xSemaphoreCreateMutex();
    Mutex_LEDWorkMode = xSemaphoreCreateMutex();
    Mutex_SmokeAlert = xSemaphoreCreateMutex();
    Mutex_Serial = xSemaphoreCreateMutex();
    Mutex_Status = xSemaphoreCreateMutex();
    Mutex_RGB = xSemaphoreCreateMutex();
    xSemaphoreGive(Mutex_CurrentSmokeThreshold);
    xSemaphoreGive(Mutex_LEDWorkMode);
    xSemaphoreGive(Mutex_SmokeAlert);
    xSemaphoreGive(Mutex_Serial);
    xSemaphoreGive(Mutex_Status);
    xSemaphoreGive(Mutex_RGB);

    analogWrite(PIN_R, GetR());
    analogWrite(PIN_G, GetG());
    analogWrite(PIN_B, GetB());

    for (int k = 0; k < 3; k++) {
        status[k] = GetLEDWorkMode(k);
        if (status[k] <= 1) {
            digitalWrite(led[k], status[k]);
        }
    }

    xTaskCreate(TaskLightIntensityData, "LightIntensityData", 72, NULL, 1, &Task_LightIntensityData);
    xTaskCreate(TaskSmokeData, "SmokeData", 72, NULL, 1, &Task_SmokeData);
    //xTaskCreate(TaskStatusData, "StatusData", 60, NULL, 1, &Task_StatusData);
    xTaskCreate(TaskTemperatureData, "TemperatureData", 72, NULL, 1, &Task_TemperatureData);
    xTaskCreate(TaskSendData, "SendData", 96, NULL, 2, &Task_SendData);
    xTaskCreate(TaskGetData, "GetData", 96, NULL, 2, &Task_GetData);

    vTaskStartScheduler();
}

void loop() {}

int GetSmokeThreshold() {
    xSemaphoreTake(Mutex_CurrentSmokeThreshold, portMAX_DELAY);
    int data1 = (int)EEPROM.read(ADDR_SMOKE_THRESHOLD);
    int data2 = (int)EEPROM.read(ADDR_SMOKE_THRESHOLD + 1);
    int data = (data1 << 8) + data2;
    xSemaphoreGive(Mutex_CurrentSmokeThreshold);
    return data;
}

void SetSmokeThreshold(int value) {
    xSemaphoreTake(Mutex_CurrentSmokeThreshold, portMAX_DELAY);
    EEPROM.write(ADDR_SMOKE_THRESHOLD, byte(value >> 8));
    EEPROM.write(ADDR_SMOKE_THRESHOLD + 1, byte(value & ((1 << 8) - 1)));
    xSemaphoreGive(Mutex_CurrentSmokeThreshold);
}

void SmokeAlert(bool isOn) {
    xSemaphoreTake(Mutex_SmokeAlert, portMAX_DELAY);
    if (isOn) {
        analogWrite(PIN_SOUNDER, 127);
    } else {
        analogWrite(PIN_SOUNDER, 0);
    }
    xSemaphoreGive(Mutex_SmokeAlert);
}

int GetLEDWorkMode(int id) {
    xSemaphoreTake(Mutex_LEDWorkMode, portMAX_DELAY);
    int value = EEPROM.read(ADDR_LED_WORKMODE + id);
    xSemaphoreGive(Mutex_LEDWorkMode);
    return value;
}

void SetLEDWorkMode(int id, int value) {
    xSemaphoreTake(Mutex_LEDWorkMode, portMAX_DELAY);
    switch (value) {
    case 0:
    case 1:
        EEPROM.write(ADDR_LED_WORKMODE + id, byte(value));
        digitalWrite(led[id], value);
        break;
    case 2:
        EEPROM.write(ADDR_LED_WORKMODE + id, byte(value));
        break;
    }
    xSemaphoreGive(Mutex_LEDWorkMode);
    xSemaphoreTake(Mutex_Status, portMAX_DELAY);
    status[id] = value;
    xSemaphoreGive(Mutex_Status);
}

void SetRGBValue(int R, int G, int B) {
    xSemaphoreTake(Mutex_RGB, portMAX_DELAY);
    EEPROM.write(ADDR_RGB_VALUE, byte(R));
    EEPROM.write(ADDR_RGB_VALUE + 1, byte(G));
    EEPROM.write(ADDR_RGB_VALUE + 2, byte(B));
    xSemaphoreGive(Mutex_RGB);
}

int GetR() {
    xSemaphoreTake(Mutex_RGB, portMAX_DELAY);
    int res = (int)EEPROM.read(ADDR_RGB_VALUE);
    xSemaphoreGive(Mutex_RGB);
    return res;
}

int GetG() {
    xSemaphoreTake(Mutex_RGB, portMAX_DELAY);
    int res = (int)EEPROM.read(ADDR_RGB_VALUE + 1);
    xSemaphoreGive(Mutex_RGB);
    return res;
}

int GetB() {
    xSemaphoreTake(Mutex_RGB, portMAX_DELAY);
    int res = (int)EEPROM.read(ADDR_RGB_VALUE + 2);
    xSemaphoreGive(Mutex_RGB);
    return res;
}

char datestring[20];
void printDateTime(const RtcDateTime& dt)
{
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


int voltage, mode;
DataToServer lightIntensityData;

void TaskLightIntensityData(void *pvParameters) {
    for (;;) {
        voltage = analogRead(PIN_LDR);
        lightIntensityData = (DataToServer){LightIntensity, (float)voltage, 0.0, 0};
        xQueueSend(Queue_SendData, &lightIntensityData, portMAX_DELAY);
        for (int k = 0; k < 3; k++) {
            mode = GetLEDWorkMode(k);
            if (mode == 2) {
                analogWrite(led[k], int((1.0 - (1.0 * voltage) / (1.0 * 1024)) * (1.0 * 255)));
            }
        }
        vTaskDelay(1000 / portTICK_PERIOD_MS * 10);
    }
}

void TaskSmokeData(void *pvParameters) {
    int smokeData, smokeThreshold;
    for (;;) {
        smokeData = analogRead(PIN_SMOKE);
        smokeThreshold = GetSmokeThreshold();
        if (smokeData >= smokeThreshold) {
            //SmokeAlert(true);
        } else {
            SmokeAlert(false);
        }
        DataToServer data = (DataToServer){Smoke, (float)smokeData, (float)smokeThreshold, 0};
        xQueueSend(Queue_SendData, &data, portMAX_DELAY);
        vTaskDelay(1000 / portTICK_PERIOD_MS * 10);
    }
}

DataToServer statusData;

void TaskStatusData(void *pvParameters) {
    for (;;) {
        statusData = (DataToServer){LEDStatus, (float)status[0], (float)status[1], (float)status[2]};
        xQueueSend(Queue_SendData, &statusData, portMAX_DELAY);
        statusData = (DataToServer){RGBStatus, (float)GetR(), (float)GetG(), (float)GetB()};
        xQueueSend(Queue_SendData, &statusData, portMAX_DELAY);
        vTaskDelay(1000 / portTICK_PERIOD_MS * 3);
    }
}

float t;
DataToServer temperatureData;

void TaskTemperatureData(void *pvParameters) {
    for(;;) {
        t = analogRead(PIN_LM35) * 0.48828125;
        temperatureData = (DataToServer){Temprature, t, 0, 0};
        xQueueSend(Queue_SendData, &temperatureData, portMAX_DELAY);
        vTaskDelay(1000 / portTICK_PERIOD_MS * 10);
    }
}

DataToServer dataToServer;

void TaskSendData(void *pvParameters) {
    for (;;) {
        if (xQueueReceive(Queue_SendData, &dataToServer, portMAX_DELAY) == pdPASS) {
            xSemaphoreTake(Mutex_Serial, portMAX_DELAY);
            Serial.print(dataToServer.type);
            Serial.print(" ");
            Serial.print(dataToServer.value1);
            Serial.print(" ");
            Serial.print(dataToServer.value2);
            Serial.print(" ");
            Serial.print(dataToServer.value3);
            Serial.print(" ");
            printDateTime(Rtc.GetDateTime());
            Serial.println();
            xSemaphoreGive(Mutex_Serial);
        }
        vTaskDelay((1000) / portTICK_PERIOD_MS * 2);
    }
}

String strRead;
DataFromServer dataFromServer;

void TaskGetData(void *pvParameters) {
    for (;;) {
        strRead = "";
        while (Serial.available() > 0){
            strRead += char(Serial.read());
            vTaskDelay(2 / portTICK_PERIOD_MS);
        }
        sscanf(strRead.c_str(), "%d%d%d%d%d", (int *)&dataFromServer.type, &dataFromServer.id, &dataFromServer.value, &dataFromServer.value2, &dataFromServer.value3);
        switch (dataFromServer.type) {
        case LED:
            SetLEDWorkMode(dataFromServer.id, dataFromServer.value);
            break;
        case SmokeThreshold:
            SetSmokeThreshold(dataFromServer.value);
            break;
        case RGB:
            SetRGBValue(dataFromServer.value, dataFromServer.value2, dataFromServer.value3);
            analogWrite(PIN_R, dataFromServer.value);
            analogWrite(PIN_G, dataFromServer.value2);
            analogWrite(PIN_B, dataFromServer.value3);
            break;
        }
        vTaskDelay(1000 / portTICK_PERIOD_MS * 2);
    }
}