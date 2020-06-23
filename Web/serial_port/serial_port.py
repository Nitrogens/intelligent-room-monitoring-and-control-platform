import serial
import redis
import time

KEY_LIGHT = "list_light"
KEY_SMOKE = "list_smoke"
KEY_SMOKE_THRESHOLD = "key_smoke_threshold"
KEY_TEMPERATURE = "list_temperature"
KEY_TASKS = "list_tasks"

r = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)


def data_process(data_str: str):
    data_list = data_str.split(" ")
    timestamp = int(time.mktime(time.strptime(data_list[-2] + " " + data_list[-1], "%Y/%m/%d %H:%M:%S")))
    # if data_list[0] == '0':
    #     r.rpush(KEY_LIGHT, "%s, %s" % (timestamp, int(float(data_list[1]))))
    # elif data_list[0] == '1':
    #     r.rpush(KEY_SMOKE, "%s, %s" % (timestamp, int(float(data_list[1]))))
    #     r.set(KEY_SMOKE_THRESHOLD, str(int(float((data_list[2])))))
    # elif data_list[0] == '2':
    #     r.rpush(KEY_TEMPERATURE, "%s, %s" % (timestamp, float(data_list[1])))
    print("[Read]", data_list, timestamp)


def main():
    try:
        portx = "/dev/ttyS2"
        bps = 9600
        timex = None
        ser = serial.Serial(portx, bps, timeout=timex)
        data_str = ""
        while True:
            if r.llen(KEY_TASKS) > 0:
                task = r.lpop(KEY_TASKS)
                ser.write(bytes(task))
                print("[Write] {%s}" % task)
            elif ser.in_waiting:
                data = ser.read(ser.in_waiting).decode("ascii")
                if data == "\r":
                    continue
                elif data == "\n":
                    data_process(data_str)
                    data_str = ""
                    continue
                data_str += str(data)
                # print(data)
    except Exception as e:
        print("Error", e)


if __name__ == "__main__":
    main()