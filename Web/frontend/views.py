from django.shortcuts import render


def dashboard(request):
    return render(request, 'dashboard.html', locals())


def statistics(request):
    return render(request, 'statistics.html', locals())
