from django.urls import path
from . import views

urlpatterns = [
    path('validarXML/', views.validarXML, name='validarXML'),
    path('facturas/', views.obtenerFacturas, name='obtener_facturas'),
    path('facturas/<int:id>/', views.obtenerFactura, name='obtener_factura'),
    path('facturas/update/<int:id>/', views.actualizarFactura, name='update_factura'),
    path('facturas/delete/<int:id>/', views.eliminarFactura, name='delete_factura'),
]
