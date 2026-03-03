import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface InvoiceData {
    invoiceNumber: string;
    date: Date;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    description: string;
    amount: number;
    days: number;
}

export const generateInvoice = (data: InvoiceData): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            // Ensure invoices directory exists
            const invoicesDir = path.join(__dirname, '../../invoices');
            if (!fs.existsSync(invoicesDir)) {
                fs.mkdirSync(invoicesDir, { recursive: true });
            }

            const invoicePath = path.join(invoicesDir, `${data.invoiceNumber}.pdf`);
            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(invoicePath);

            doc.pipe(stream);

            // --- Header ---
            // Logo
            const logoPath = path.join(__dirname, '../../assets/logo.png');
            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 50, 45, { width: 150 });
            } else {
                doc.fontSize(20).text(process.env.COMPANY_NAME || 'BOKELAND', 50, 50);
            }

            // Company Details (Right aligned)
            doc.fillColor('#444444')
                .fontSize(10)
                .text(process.env.COMPANY_NAME || 'BOKELAND', 200, 50, { align: 'right' })
                .text(process.env.COMPANY_ADDRESS || '', 200, 65, { align: 'right' })
                .text(`Tel: ${process.env.COMPANY_PHONE || ''}`, 200, 80, { align: 'right' })
                .text(process.env.COMPANY_EMAIL || '', 200, 95, { align: 'right' })
                .moveDown();

            // --- Invoice Title & Details ---
            doc.fillColor('#000000')
                .fontSize(20)
                .text('FACTURE', 50, 160);

            // Divider
            generateHr(doc, 185);

            const customerInformationTop = 200;

            doc.fontSize(10)
                .text('Numéro de facture:', 50, customerInformationTop)
                .font('Helvetica-Bold')
                .text(data.invoiceNumber, 150, customerInformationTop)
                .font('Helvetica')
                .text('Date:', 50, customerInformationTop + 15)
                .text(new Date(data.date).toLocaleDateString(), 150, customerInformationTop + 15)

                .font('Helvetica-Bold')
                .text('Facturé à:', 350, customerInformationTop)
                .font('Helvetica')
                .text(data.clientName, 350, customerInformationTop + 15)
                .text(data.clientEmail, 350, customerInformationTop + 30)
                .text(data.clientPhone || '', 350, customerInformationTop + 45)
                .moveDown();

            generateHr(doc, 252);

            // --- Table Header ---
            const iInvoiceTableTop = 330;

            doc.font('Helvetica-Bold');
            generateTableRow(
                doc,
                iInvoiceTableTop,
                'Description',
                'Quantité',
                'Prix Unitaire',
                'Total'
            );
            generateHr(doc, iInvoiceTableTop + 20);
            doc.font('Helvetica');

            // --- Table Content ---
            const iInvoiceTableContent = 355;
            generateTableRow(
                doc,
                iInvoiceTableContent,
                data.description,
                '1',
                formatCurrency(data.amount),
                formatCurrency(data.amount)
            );

            generateHr(doc, iInvoiceTableContent + 20);

            // --- Total ---
            const subtotalPosition = iInvoiceTableContent + 40;
            doc.font('Helvetica-Bold');
            generateTableRow(
                doc,
                subtotalPosition,
                '',
                '',
                'TOTAL',
                formatCurrency(data.amount)
            );

            // --- Footer ---
            generateHr(doc, subtotalPosition + 35);
            doc.fontSize(10)
                .text(
                    'Merci pour votre confiance.',
                    50,
                    700,
                    { align: 'center', width: 500 }
                );

            doc.end();

            stream.on('finish', () => {
                resolve(invoicePath);
            });
            stream.on('error', (err) => {
                reject(err);
            });

        } catch (error) {
            reject(error);
        }
    });
};

function generateHr(doc: any, y: number) {
    doc.strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

// Fixed table row logic for better alignment
function generateTableRow(
    doc: any,
    y: number,
    item: string,
    qty: string,
    price: string,
    total: string
) {
    doc.fontSize(10)
        .text(item, 50, y)
        .text(qty, 280, y, { width: 90, align: 'right' })
        .text(price, 370, y, { width: 90, align: 'right' })
        .text(total, 0, y, { align: 'right' });
}

function formatCurrency(amount: number) {
    return amount.toLocaleString() + ' FCFA';
}
