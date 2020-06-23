from django.contrib import admin
from django.urls import path, include
from api.views import LightIntensityAction, SmokeAction, TemperatureAction,\
    SetLEDWorkModeAction, SetSmokeThresholdAction, SetRGBAction

urlpatterns = [
    path('light-intensity', LightIntensityAction.as_view()),
    path('smoke', SmokeAction.as_view()),
    path('temperature', TemperatureAction.as_view()),
    path('setting/led-work-mode', SetLEDWorkModeAction.as_view()),
    path('setting/set-smoke-threshold', SetSmokeThresholdAction.as_view()),
    path('setting/rgb', SetRGBAction.as_view()),
]
