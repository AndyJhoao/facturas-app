from django.db import models

class Factura(models.Model):
    id_factura = models.CharField(max_length=100)
    proveedor = models.CharField(max_length=100)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateField()
    tipo_comprobante = models.CharField(max_length=2)

    # xml_file = models.FileField(upload_to='facturas/')
    def __str__(self):
        return self.proveedor
