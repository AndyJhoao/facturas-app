from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response 
from xml.etree import ElementTree
from datetime import datetime
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404

from .models import Factura
from django.contrib.auth.models import User
from .serializers import FacturaSerializer, UserSerializer

@api_view(['POST'])
def login(request):

    user = get_object_or_404(User, username=request.data['username'])

    if not user.check_password(request.data['password']):
        return Response({"error":"contraseña incorrecta"},status=400)

    token, created = Token.objects.get_or_create(user=user)

    serializer = UserSerializer(instance=user)

    return Response({'token':token.key,'user':serializer.data},status=200)
    
@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if(serializer.is_valid()):
        serializer.save()

        user = User.objects.get(username=serializer.data['username'])
        user.set_password(serializer.data['password'])
        user.save()

        # token = Token.objects.create(user=user)
        return Response({'user':serializer.data['username']},status=201)
    else:
        return Response(serializer.errors, status=400)
    
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def obtenerFacturas(request):
    facturas = Factura.objects.all()
    serializer = FacturaSerializer(facturas, many=True)
    if facturas.exists():
        return Response(serializer.data)
    else:
        return Response({'error': 'Sin facturas'}, status=404)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def obtenerFactura(request,id):
    try:
        factura = Factura.objects.get(id=id)
        serializer = FacturaSerializer(factura)
    except Factura.DoesNotExist:
        return Response({'error': 'Factura no encontrada'}, status=404)
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def validarXML(request):
    xml_file = request.FILES.get('xmlFact')
    formData = request.data
    if not xml_file:
        response = crearRegistro(formData)
        return response
    else:
        tree = ElementTree.parse(xml_file)
        root = tree.getroot()

        valuesXML = {
            'id_factura':'',
            'proveedor': '',
            'value': 0,
            'fecha':'',
            'tipo_comprobante': '',
        }
        fecha = root.attrib.get('Fecha')

        valuesXML['fecha'] = datetime.strptime(fecha, '%Y-%m-%dT%H:%M:%S').date()
        valuesXML['tipo_comprobante'] = root.attrib.get('TipoDeComprobante')

        emisor = root.find('{http://www.sat.gob.mx/cfd/4}Emisor')
        if emisor is not None and 'Nombre' in emisor.attrib:
            valuesXML['proveedor'] = emisor.attrib['Nombre']

        concepto = root.find('{http://www.sat.gob.mx/cfd/4}Conceptos/{http://www.sat.gob.mx/cfd/4}Concepto')
        if concepto is not None and 'Importe' in concepto.attrib:
            valuesXML['value'] = concepto.attrib['Importe']

        timbre = root.find('{http://www.sat.gob.mx/cfd/4}Complemento/{http://www.sat.gob.mx/TimbreFiscalDigital}TimbreFiscalDigital')
        if timbre is not None and 'UUID' in timbre.attrib:
            valuesXML['id_factura'] = timbre.attrib['UUID']

        validated = validateDuplication(valuesXML['id_factura'])
        if validated:
            Factura.objects.create(**valuesXML)
            return Response(valuesXML,status=201)

        else:
            return Response({'error':'Ya existe la factura'},status=409)

def validateDuplication(id):
    factura = Factura.objects.filter(id_factura=id)
    if not factura:
        return True
    else:
        return False
    
def crearRegistro(data):
    validated = validateDuplication(data.get('id_factura'))
    if validated:
        data = {
            'id_factura': data.get('idfact'),
            'proveedor': data.get('proveedorfact'),
            'value': data.get('valorfact'),
            'fecha': data.get('fechafact'),
            'tipo_comprobante': data.get('tipoComprobante'),
        }
        serializer = FacturaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=201)
        else:
            return Response({'error': 'Datos no validos para el registro'}, status=404)
    else:
        return Response({'error':'Ya existe la factura con ese UUID'},status=409)

@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def actualizarFactura(request,id):
    try:
        factura = Factura.objects.get(id=id)
    except Factura.DoesNotExist:
        return Response({'error': 'Factura no encontrada'}, status=404)
    
    serializer = FacturaSerializer(factura,data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response({'error': 'Datos no validos para el registro'}, status=404)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def eliminarFactura(request,id):
    try:
        factura = Factura.objects.get(id=id)
    except Factura.DoesNotExist:
        return Response({'error': 'Factura no encontrada'}, status=404)
    factura.delete()
    return Response({'success':'Se eliminó correctamente la factura'}, status=200)
    
