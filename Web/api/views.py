import redis

from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt

KEY_LIGHT = "list_light"
KEY_SMOKE = "list_smoke"
KEY_TEMPERATURE = "list_temperature"
KEY_TASKS = "list_tasks"

KEY_SMOKE_THRESHOLD = "key_smoke_threshold"
KEY_LED_WORK_MODE = "key_led_work_mode_%s"
KEY_R = "key_r"
KEY_G = "key_g"
KEY_B = "key_b"

r = redis.StrictRedis(host='127.0.0.1', port=6379, db=0)


class BasicInfoAction(View):
    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        if request.method.lower() in self.http_method_names:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        return handler(request, *args, **kwargs)

    def get(self, request):
        light_data = str(r.lindex(KEY_LIGHT, -1)).split(", ")[1][:-1]
        smoke_data = str(r.lindex(KEY_SMOKE, -1)).split(", ")[1][:-1]
        smoke_threshold_data = r.get(KEY_SMOKE_THRESHOLD)
        temperature_data = str(r.lindex(KEY_TEMPERATURE, -1)).split(", ")[1][:-1]
        print(light_data, smoke_data, temperature_data)
        return JsonResponse({
            'message': 'OK',
            'data': {
                'light': int(float(light_data)),
                'smoke': int(float(smoke_data)),
                'smoke_threshold': int(float(smoke_threshold_data)),
                'temperature': float(temperature_data),
            }
        })


class LEDStatusAction(View):
    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        if request.method.lower() in self.http_method_names:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        return handler(request, *args, **kwargs)

    def get(self, request):
        led0_data = r.get(KEY_LED_WORK_MODE % "0")
        led1_data = r.get(KEY_LED_WORK_MODE % "1")
        led2_data = r.get(KEY_LED_WORK_MODE % "2")
        print(led0_data, led1_data, led2_data)
        return JsonResponse({
            'message': 'OK',
            'data': {
                'led_0': int(float(led0_data)),
                'led_1': int(float(led1_data)),
                'led_2': int(float(led2_data)),
            }
        })


class LightIntensityAction(View):
    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        if request.method.lower() in self.http_method_names:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        return handler(request, *args, **kwargs)

    def get(self, request):
        data_str_list = r.lrange(KEY_LIGHT, -10, -1)
        print(data_str_list)
        data_list = []
        for data_str in data_str_list:
            data_tuple = str(data_str.decode("ascii")).split(", ")
            data_list.append((int(data_tuple[0]), float(data_tuple[1])))
        return JsonResponse({'message': 'OK', 'data': data_list})


class SmokeAction(View):
    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        if request.method.lower() in self.http_method_names:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        return handler(request, *args, **kwargs)

    def get(self, request):
        smoke_threshold = int(r.get(KEY_SMOKE_THRESHOLD))
        data_str_list = r.lrange(KEY_SMOKE, -10, -1)
        print(data_str_list)
        data_list = []
        for data_str in data_str_list:
            data_tuple = str(data_str.decode("ascii")).split(", ")
            data_list.append((int(data_tuple[0]), float(data_tuple[1])))
        return JsonResponse({'message': 'OK', 'data': data_list, 'threshold': smoke_threshold})


class TemperatureAction(View):
    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        if request.method.lower() in self.http_method_names:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        return handler(request, *args, **kwargs)

    def get(self, request):
        data_str_list = r.lrange(KEY_TEMPERATURE, -10, -1)
        print(data_str_list)
        data_list = []
        for data_str in data_str_list:
            data_tuple = str(data_str.decode("ascii")).split(", ")
            data_list.append((int(data_tuple[0]), float(data_tuple[1])))
        return JsonResponse({'message': 'OK', 'data': data_list})


class SetLEDWorkModeAction(View):
    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        if request.method.lower() in self.http_method_names:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        return handler(request, *args, **kwargs)

    def get(self, request):
        led_id = request.GET.get('id')
        if led_id is None:
            return JsonResponse({'message': 'Failed', 'data': []})
        led_status = int(request.GET.get('status'))
        if led_status is None:
            return JsonResponse({'message': 'Failed', 'data': []})
        r.rpush(KEY_TASKS, "0 %s %s 0 0" % (led_id, led_status))
        r.set(KEY_LED_WORK_MODE % led_id, led_status)
        return JsonResponse({'message': 'OK', 'data': []})


class SetSmokeThresholdAction(View):
    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        if request.method.lower() in self.http_method_names:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        return handler(request, *args, **kwargs)

    def get(self, request):
        value = int(request.GET.get('value'))
        if value is None:
            return JsonResponse({'message': 'Failed', 'data': []})
        r.rpush(KEY_TASKS, "1 0 %s 0 0" % value)
        r.set(KEY_SMOKE_THRESHOLD, value)
        return JsonResponse({'message': 'OK', 'data': []})


class SetRGBAction(View):
    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        if request.method.lower() in self.http_method_names:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        return handler(request, *args, **kwargs)

    def get(self, request):
        R = int(request.GET.get('r'))
        if R is None:
            return JsonResponse({'message': 'Failed', 'data': []})
        G = int(request.GET.get('g'))
        if G is None:
            return JsonResponse({'message': 'Failed', 'data': []})
        B = int(request.GET.get('b'))
        if B is None:
            return JsonResponse({'message': 'Failed', 'data': []})
        r.rpush(KEY_TASKS, "2 0 %s %s %s" % (R, G, B))
        r.set(KEY_R, R)
        r.set(KEY_G, G)
        r.set(KEY_B, B)
        return JsonResponse({'message': 'OK', 'data': []})
