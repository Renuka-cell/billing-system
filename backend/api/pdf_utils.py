import os

from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
)

from reportlab.lib import colors

from reportlab.lib.pagesizes import A4

from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle,
)

from reportlab.lib.enums import (
    TA_LEFT,
    TA_RIGHT,
    TA_CENTER,
)

from reportlab.platypus.flowables import (
    HRFlowable
)

from django.conf import settings

from .models import ShopDetails


def generate_invoice_pdf(invoice):

    # =========================================
    # FILE PATH
    # =========================================
    file_name = f"invoice_{invoice.id}.pdf"

    file_path = os.path.join(
        settings.MEDIA_ROOT,
        file_name
    )

    # =========================================
    # DOCUMENT
    # =========================================
    doc = SimpleDocTemplate(
        file_path,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=20,
        bottomMargin=22,
    )

    PAGE_W = A4[0] - 72

    styles = getSampleStyleSheet()

    elements = []

    # =========================================
    # COLORS
    # =========================================
    NAVY = colors.HexColor("#0D1B2A")

    SLATE = colors.HexColor("#1C3251")

    TEAL = colors.HexColor("#0EA5C8")

    TEAL_PALE = colors.HexColor("#E8F8FC")

    TEAL_SOFT = colors.HexColor("#C8EEF7")

    WHITE = colors.white

    OFF_WHITE = colors.HexColor("#F7FAFC")

    GRAY_600 = colors.HexColor("#5A6A7A")

    GRAY_900 = colors.HexColor("#111827")

    # =========================================
    # MONEY FORMAT
    # =========================================
    def money(value):

        try:

            return f"Rs. {float(value):,.2f}"

        except:

            return "--"

    # =========================================
    # SAFE VALUE
    # =========================================
    def safe_value(value):

        if (
            value is None
            or value == ""
            or str(value).lower() == "not required"
        ):

            return "--"

        return str(value)

    # =========================================
    # PROFESSIONAL INVOICE NUMBER
    # =========================================
    try:

        inv_year = str(invoice.date.year)

        inv_seq = str(
            int(invoice.id)
        ).zfill(3)

        inv_label = (
            f"INV-{inv_year}-{inv_seq}"
        )

    except Exception:

        inv_label = str(
            invoice.invoice_number
        )

    # =========================================
    # PAYMENT STATUS
    # =========================================
    payment_status = str(
        invoice.payment_status
    ).upper()

    # =========================================
    # STYLE FACTORY
    # =========================================
    def ps(
        name,
        size=9,
        color=None,
        bold=False,
        align=TA_LEFT,
        leading=None,
    ):

        return ParagraphStyle(
            name,
            parent=styles["Normal"],
            fontSize=size,
            textColor=color or GRAY_600,
            fontName=(
                "Helvetica-Bold"
                if bold
                else "Helvetica"
            ),
            alignment=align,
            leading=leading or (
                size + 3
            ),
        )

    # =========================================
    # STYLES
    # =========================================
    S_BRAND = ps(
        "S_BRAND",
        22,
        WHITE,
        True
    )

    S_SUB = ps(
        "S_SUB",
        9,
        TEAL,
        True
    )

    S_BODY = ps(
        "S_BODY",
        8.5,
        GRAY_600
    )

    S_BODY_BOLD = ps(
        "S_BODY_BOLD",
        8.5,
        GRAY_900,
        True
    )

    S_INV = ps(
        "S_INV",
        30,
        WHITE,
        True,
        TA_RIGHT
    )

    S_INV_NO = ps(
        "S_INV_NO",
        9,
        TEAL,
        True,
        TA_RIGHT
    )

    S_DATE = ps(
        "S_DATE",
        8.5,
        WHITE,
        False,
        TA_RIGHT
    )

    S_LABEL = ps(
        "S_LABEL",
        7,
        TEAL,
        True
    )

    S_TITLE = ps(
        "S_TITLE",
        13,
        GRAY_900,
        True
    )

    S_SECTION = ps(
        "S_SECTION",
        8,
        TEAL,
        True
    )

    S_TABLE_HEAD = ps(
        "S_TABLE_HEAD",
        8,
        WHITE,
        True,
        TA_CENTER
    )

    S_TABLE_HEAD_L = ps(
        "S_TABLE_HEAD_L",
        8,
        WHITE,
        True
    )

    S_TABLE_BODY = ps(
        "S_TABLE_BODY",
        8.5,
        GRAY_900
    )

    S_TABLE_BODY_C = ps(
        "S_TABLE_BODY_C",
        8.5,
        GRAY_900,
        False,
        TA_CENTER
    )

    S_TABLE_BODY_R = ps(
        "S_TABLE_BODY_R",
        8.5,
        GRAY_900,
        False,
        TA_RIGHT
    )

    S_TABLE_BODY_R_BOLD = ps(
        "S_TABLE_BODY_R_BOLD",
        8.5,
        GRAY_900,
        True,
        TA_RIGHT
    )

    S_TOTAL_L = ps(
        "S_TOTAL_L",
        8.5,
        GRAY_600,
        False,
        TA_RIGHT
    )

    S_TOTAL_R = ps(
        "S_TOTAL_R",
        8.5,
        GRAY_900,
        True,
        TA_RIGHT
    )

    S_GRAND_L = ps(
        "S_GRAND_L",
        9,
        WHITE,
        True,
        TA_RIGHT
    )

    S_GRAND_R = ps(
        "S_GRAND_R",
        9,
        TEAL,
        True,
        TA_RIGHT
    )

    # =========================================
    # HELPER LINE
    # =========================================
    def line():

        return HRFlowable(
            width="100%",
            thickness=0.5,
            color=TEAL_SOFT
        )
    
    # =========================================
    # GET SHOP DETAILS
    # =========================================

    shop = ShopDetails.objects.first()

    if shop:

        shop_name = shop.shop_name

        address = shop.address

        phone = shop.phone

        email = shop.email

        gst_number = shop.gst_number

    else:

        shop_name = "VISIONCARE"

        address = "MG Road, Bengaluru, Karnataka"

        phone = "+91 9876543210"

        email = ""

        gst_number = ""

    # =========================================
    # HEADER
    # =========================================
    left_header = [

        Paragraph(
            shop_name,
            S_BRAND
        ),

        Paragraph(
            "OPTICALS",
            S_SUB
        ),

        Spacer(1, 5),

        Paragraph(
            address,
            S_BODY
        ),

        Paragraph(
            f"Phone: {phone}",
            S_BODY
        ),

        Paragraph(
            f"Email: {email}",
            S_BODY
        ),

        Paragraph(
            f"GST: {gst_number}",
            S_BODY
        ),
    ]

    right_header = [

        Paragraph(
            "INVOICE",
            S_INV
        ),

        Paragraph(
            inv_label,
            S_INV_NO
        ),

        Spacer(1, 4),

        Paragraph(
            f"Date : {invoice.date}",
            S_DATE
        ),
    ]

    header_table = Table(
        [[left_header, right_header]],
        colWidths=[
            PAGE_W * 0.55,
            PAGE_W * 0.45
        ]
    )

    header_table.setStyle(
        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (-1, -1),
                NAVY
            ),

            (
                "LEFTPADDING",
                (0, 0),
                (-1, -1),
                20
            ),

            (
                "RIGHTPADDING",
                (0, 0),
                (-1, -1),
                20
            ),

            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                18
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                18
            ),

            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "MIDDLE"
            ),
        ])
    )

    elements.append(header_table)

    # =========================================
    # BLUE STRIP
    # =========================================
    strip = Table(
        [[""]],
        colWidths=[PAGE_W]
    )

    strip.setStyle(
        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (-1, -1),
                TEAL
            ),

            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                3
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                3
            ),
        ])
    )

    elements.append(strip)

    elements.append(
        Spacer(1, 15)
    )

    # =========================================
    # CUSTOMER INFO
    # =========================================
    customer_table = Table(
        [[

            [

                Paragraph(
                    "BILL TO",
                    S_LABEL
                ),

                Paragraph(
                    invoice.customer.name,
                    S_TITLE
                ),

                Paragraph(
                    invoice.customer.mobile,
                    S_BODY
                ),

                Paragraph(
                    invoice.customer.email,
                    S_BODY
                ),
            ],

            [

                Paragraph(
                    "PAYMENT STATUS",
                    S_LABEL
                ),

                Paragraph(
                    payment_status,
                    S_BODY_BOLD
                ),

                Spacer(1, 10),

                Paragraph(
                    "PAYMENT MODE",
                    S_LABEL
                ),

                Paragraph(
                    invoice.payment_mode,
                    S_BODY_BOLD
                ),
            ],
        ]],

        colWidths=[
            PAGE_W * 0.65,
            PAGE_W * 0.35
        ]
    )

    customer_table.setStyle(
        TableStyle([

            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "TOP"
            ),

            (
                "LEFTPADDING",
                (0, 0),
                (-1, -1),
                0
            ),
        ])
    )

    elements.append(customer_table)

    elements.append(
        Spacer(1, 12)
    )

    elements.append(line())

    elements.append(
        Spacer(1, 15)
    )

    # =========================================
    # FRAME DETAILS
    # =========================================
    frame_total = (
        invoice.frame_quantity
        * invoice.frame_price
    )

    if (
        invoice.frame_type == "Not Required"
        or invoice.frame_quantity == 0
    ):

        frame_name = "--"

        frame_qty = "--"

        frame_price = "--"

        frame_total_show = "--"

    else:

        frame_name = invoice.frame_type

        frame_qty = str(
            invoice.frame_quantity
        )

        frame_price = money(
            invoice.frame_price
        )

        frame_total_show = money(
            frame_total
        )

    elements.append(
        Paragraph(
            "FRAME DETAILS",
            S_SECTION
        )
    )

    elements.append(
        Spacer(1, 8)
    )

    frame_table = Table(

        [

            [

                Paragraph(
                    "Frame Type",
                    S_TABLE_HEAD_L
                ),

                Paragraph(
                    "Quantity",
                    S_TABLE_HEAD
                ),

                Paragraph(
                    "Price",
                    S_TABLE_HEAD
                ),

                Paragraph(
                    "Total",
                    S_TABLE_HEAD
                ),
            ],

            [

                Paragraph(
                    frame_name,
                    S_TABLE_BODY
                ),

                Paragraph(
                    frame_qty,
                    S_TABLE_BODY_C
                ),

                Paragraph(
                    frame_price,
                    S_TABLE_BODY_R
                ),

                Paragraph(
                    frame_total_show,
                    S_TABLE_BODY_R_BOLD
                ),
            ],
        ],

        colWidths=[
            PAGE_W * 0.40,
            PAGE_W * 0.15,
            PAGE_W * 0.20,
            PAGE_W * 0.25,
        ]
    )

    frame_table.setStyle(
        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                SLATE
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                WHITE
            ),

            (
                "BACKGROUND",
                (0, 1),
                (-1, -1),
                OFF_WHITE
            ),

            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                8
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                8
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                TEAL_SOFT
            ),
        ])
    )

    elements.append(frame_table)

    elements.append(
        Spacer(1, 15)
    )

    # =========================================
    # GLASS DETAILS
    # =========================================
    glass_total = (
        invoice.glass_quantity
        * invoice.glass_price
    )

    if (
        invoice.glass_type == "Not Required"
        or invoice.glass_quantity == 0
    ):

        glass_name = "--"

        glass_qty = "--"

        glass_price = "--"

        glass_total_show = "--"

    else:

        glass_name = invoice.glass_type

        glass_qty = str(
            invoice.glass_quantity
        )

        glass_price = money(
            invoice.glass_price
        )

        glass_total_show = money(
            glass_total
        )

    elements.append(
        Paragraph(
            "GLASS DETAILS",
            S_SECTION
        )
    )

    elements.append(
        Spacer(1, 8)
    )

    glass_table = Table(

        [

            [

                Paragraph(
                    "Glass Type",
                    S_TABLE_HEAD_L
                ),

                Paragraph(
                    "Quantity",
                    S_TABLE_HEAD
                ),

                Paragraph(
                    "Price",
                    S_TABLE_HEAD
                ),

                Paragraph(
                    "Total",
                    S_TABLE_HEAD
                ),
            ],

            [

                Paragraph(
                    glass_name,
                    S_TABLE_BODY
                ),

                Paragraph(
                    glass_qty,
                    S_TABLE_BODY_C
                ),

                Paragraph(
                    glass_price,
                    S_TABLE_BODY_R
                ),

                Paragraph(
                    glass_total_show,
                    S_TABLE_BODY_R_BOLD
                ),
            ],
        ],

        colWidths=[
            PAGE_W * 0.40,
            PAGE_W * 0.15,
            PAGE_W * 0.20,
            PAGE_W * 0.25,
        ]
    )

    glass_table.setStyle(
        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                SLATE
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                WHITE
            ),

            (
                "BACKGROUND",
                (0, 1),
                (-1, -1),
                OFF_WHITE
            ),

            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                8
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                8
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                TEAL_SOFT
            ),
        ])
    )

    elements.append(glass_table)

    elements.append(
        Spacer(1, 15)
    )

    # =========================================
    # LENS TYPE
    # =========================================
    elements.append(
        Paragraph(
            "LENS TYPE",
            S_SECTION
        )
    )

    elements.append(
        Spacer(1, 5)
    )

    lens_table = Table(
        [[
            Paragraph(
                safe_value(
                    invoice.lens_type
                ),
                S_BODY_BOLD
            )
        ]],
        colWidths=[PAGE_W]
    )

    lens_table.setStyle(
        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (-1, -1),
                TEAL_PALE
            ),

            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                8
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                8
            ),

            (
                "LEFTPADDING",
                (0, 0),
                (-1, -1),
                10
            ),
        ])
    )

    elements.append(lens_table)

    elements.append(
        Spacer(1, 18)
    )

    # =========================================
    # EYE PRESCRIPTION
    # =========================================
    elements.append(
        Paragraph(
            "EYE PRESCRIPTION",
            S_SECTION
        )
    )

    elements.append(
        Spacer(1, 8)
    )

    prescription_data = [

        [

            Paragraph(
                "EYE",
                S_TABLE_HEAD
            ),

            Paragraph(
                "SPH",
                S_TABLE_HEAD
            ),

            Paragraph(
                "CYL",
                S_TABLE_HEAD
            ),

            Paragraph(
                "AXIS",
                S_TABLE_HEAD
            ),

            Paragraph(
                "ADD",
                S_TABLE_HEAD
            ),
        ],

        [

            Paragraph(
                "RE",
                S_TABLE_BODY_C
            ),

            Paragraph(
                safe_value(
                    invoice.right_sph
                ),
                S_TABLE_BODY_C
            ),

            Paragraph(
                safe_value(
                    invoice.right_cyl
                ),
                S_TABLE_BODY_C
            ),

            Paragraph(
                safe_value(
                    invoice.right_axis
                ),
                S_TABLE_BODY_C
            ),

            Paragraph(
                safe_value(
                    invoice.right_add
                ),
                S_TABLE_BODY_C
            ),
        ],

        [

            Paragraph(
                "LE",
                S_TABLE_BODY_C
            ),

            Paragraph(
                safe_value(
                    invoice.left_sph
                ),
                S_TABLE_BODY_C
            ),

            Paragraph(
                safe_value(
                    invoice.left_cyl
                ),
                S_TABLE_BODY_C
            ),

            Paragraph(
                safe_value(
                    invoice.left_axis
                ),
                S_TABLE_BODY_C
            ),

            Paragraph(
                safe_value(
                    invoice.left_add
                ),
                S_TABLE_BODY_C
            ),
        ],
    ]

    prescription_table = Table(
        prescription_data,
        colWidths=[
            PAGE_W * 0.16,
            PAGE_W * 0.21,
            PAGE_W * 0.21,
            PAGE_W * 0.21,
            PAGE_W * 0.21,
        ]
    )

    prescription_table.setStyle(
        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                SLATE
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                WHITE
            ),

            (
                "BACKGROUND",
                (0, 1),
                (0, -1),
                TEAL
            ),

            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                8
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                8
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                TEAL_SOFT
            ),
        ])
    )

    elements.append(
        prescription_table
    )

    elements.append(
        Spacer(1, 20)
    )

    # =========================================
    # TOTALS
    # =========================================
    totals_data = [

        [

            Paragraph(
                "Subtotal",
                S_TOTAL_L
            ),

            Paragraph(
                money(
                    invoice.total_amount
                ),
                S_TOTAL_R
            ),
        ],

        [

            Paragraph(
                "Paid",
                S_TOTAL_L
            ),

            Paragraph(
                money(
                    invoice.paid_amount
                ),
                S_TOTAL_R
            ),
        ],

        [

            Paragraph(
                "Balance Due",
                S_TOTAL_L
            ),

            Paragraph(
                money(
                    invoice.due_amount
                ),
                S_TOTAL_R
            ),
        ],

        [

            Paragraph(
                "GRAND TOTAL",
                S_GRAND_L
            ),

            Paragraph(
                money(
                    invoice.total_amount
                ),
                S_GRAND_R
            ),
        ],
    ]

    totals_table = Table(
        totals_data,
        colWidths=[
            PAGE_W * 0.24,
            PAGE_W * 0.22
        ],
        hAlign="RIGHT"
    )

    totals_table.setStyle(
        TableStyle([

            (
                "BACKGROUND",
                (0, -1),
                (-1, -1),
                NAVY
            ),

            (
                "TOPPADDING",
                (0, -1),
                (-1, -1),
                9
            ),

            (
                "BOTTOMPADDING",
                (0, -1),
                (-1, -1),
                9
            ),

            (
                "TOPPADDING",
                (0, 0),
                (-1, -2),
                5
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -2),
                5
            ),
        ])
    )

    elements.append(
        totals_table
    )

    elements.append(
        Spacer(1, 20)
    )

    # =========================================
    # TERMS & CONDITIONS
    # =========================================
    terms = [

        "Goods once sold will not be exchanged.",

        "Please keep invoice for warranty purpose.",

        "Lens warranty covers manufacturing defects only.",

        "Thank you for choosing VisionCare Opticals.",
    ]

    for term in terms:

        elements.append(
            Paragraph(
                f"• {term}",
                S_BODY
            )
        )

    elements.append(
        Spacer(1, 15)
    )

    # =========================================
    # FOOTER
    # =========================================
    footer = Paragraph(

        "Thank you for visiting VisionCare Opticals",

        ps(
            "footer",
            9,
            TEAL,
            True,
            TA_CENTER
        )
    )

    elements.append(footer)

    # =========================================
    # BUILD PDF
    # =========================================
    doc.build(elements)

    return file_name