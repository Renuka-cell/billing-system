from reportlab.pdfgen import canvas
import os
from django.conf import settings

def generate_invoice_pdf(invoice):
    file_name = f"invoice_{invoice.id}.pdf"
    file_path = os.path.join(settings.MEDIA_ROOT, file_name)

    os.makedirs(settings.MEDIA_ROOT, exist_ok=True)

    c = canvas.Canvas(file_path)

    c.drawString(100, 800, "Spectacles Shop")
    c.drawString(100, 780, f"Invoice No: {invoice.invoice_number}")
    c.drawString(100, 760, f"Customer: {invoice.customer.name}")
    c.drawString(100, 740, f"Mobile: {invoice.customer.mobile}")
    c.drawString(100, 720, f"Product: {invoice.product_description}")
    c.drawString(100, 700, f"Quantity: {invoice.quantity}")
    c.drawString(100, 680, f"Rate: {invoice.rate}")
    c.drawString(100, 660, f"Total: {invoice.total_amount}")

    c.save()

    return file_name  # return only file name, not full path