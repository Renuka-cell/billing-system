'''from reportlab.pdfgen import canvas
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

    return file_name  # return only file name, not full path'''


from reportlab.pdfgen import canvas

import os

from django.conf import settings


def generate_invoice_pdf(invoice):

    file_name = f"invoice_{invoice.id}.pdf"

    file_path = os.path.join(
        settings.MEDIA_ROOT,
        file_name
    )

    os.makedirs(
        settings.MEDIA_ROOT,
        exist_ok=True
    )

    c = canvas.Canvas(file_path)

    # =========================
    # SHOP DETAILS
    # =========================
    c.setFont("Helvetica-Bold", 18)

    c.drawString(180, 800, "Spectacles Shop")

    c.setFont("Helvetica", 12)

    # =========================
    # INVOICE DETAILS
    # =========================
    c.drawString(
        100,
        760,
        f"Invoice No: {invoice.invoice_number}"
    )

    c.drawString(
        100,
        740,
        f"Date: {invoice.date}"
    )

    # =========================
    # CUSTOMER DETAILS
    # =========================
    c.drawString(
        100,
        700,
        f"Customer: {invoice.customer.name}"
    )

    c.drawString(
        100,
        680,
        f"Mobile: {invoice.customer.mobile}"
    )

    c.drawString(
        100,
        660,
        f"Email: {invoice.customer.email}"
    )

    # =========================
    # PRODUCT DETAILS
    # =========================
    c.drawString(
        100,
        620,
        f"Product: {invoice.product_description}"
    )

    c.drawString(
        100,
        600,
        f"Quantity: {invoice.quantity}"
    )

    c.drawString(
        100,
        580,
        f"Rate: ₹ {invoice.rate}"
    )

    # =========================
    # PAYMENT DETAILS
    # =========================
    c.setFont("Helvetica-Bold", 12)

    c.drawString(
        100,
        540,
        f"Total Amount: ₹ {invoice.total_amount}"
    )

    c.drawString(
        100,
        520,
        f"Paid Amount: ₹ {invoice.paid_amount}"
    )

    c.drawString(
        100,
        500,
        f"Due Amount: ₹ {invoice.due_amount}"
    )

    c.drawString(
        100,
        480,
        f"Payment Status: {invoice.payment_status}"
    )

    # =========================
    # FOOTER
    # =========================
    c.setFont("Helvetica", 10)

    c.drawString(
        100,
        420,
        "Thank you for your purchase!"
    )

    c.save()

    return file_name