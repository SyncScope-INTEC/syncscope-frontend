import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dataParam = searchParams.get('data')

    let reportData: any = {
      alerts: [],
      reportName: 'Reporte de Alertas',
      reportType: 'anomaly_detection',
      generatedAt: new Date().toISOString()
    }

    if (dataParam) {
      try {
        reportData = JSON.parse(decodeURIComponent(dataParam))
      } catch (e) {
        console.error('Error parsing report data:', e)
      }
    }

    const { alerts, reportName, reportType, generatedAt } = reportData
    const date = new Date(generatedAt).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    // Create PDF with jsPDF
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(`SyncScope - ${reportName}`, 20, 20)
    
    // Metadata
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha de generación: ${date}`, 20, 30)
    doc.text(`Tipo de reporte: ${reportType}`, 20, 36)
    
    // Summary section
    const alertsCount = alerts?.length || 0
    const highSeverityCount = alerts?.filter((a: any) => a.severity === 'alto').length || 0
    const mediumSeverityCount = alerts?.filter((a: any) => a.severity === 'medio').length || 0
    const lowSeverityCount = alerts?.filter((a: any) => a.severity === 'bajo').length || 0
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Resumen de Alertas', 20, 50)
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Total de alertas: ${alertsCount}`, 20, 60)
    doc.text(`Alertas de alta prioridad: ${highSeverityCount}`, 20, 67)
    doc.text(`Alertas de prioridad media: ${mediumSeverityCount}`, 20, 74)
    doc.text(`Alertas de prioridad baja: ${lowSeverityCount}`, 20, 81)
    
    // Table section
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Detalle de Alertas', 20, 95)
    
    // Prepare table data
    const tableData = alerts?.slice(0, 20).map((alert: any) => [
      alert.title?.substring(0, 40) || 'Sin título',
      alert.employee?.substring(0, 25) || 'N/A',
      alert.date?.substring(0, 20) || 'N/A',
      alert.severity || 'N/A'
    ]) || []
    
    // Generate table using autoTable
    autoTable(doc, {
      startY: 100,
      head: [['Título', 'Empleado', 'Fecha', 'Severidad']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [147, 51, 234], // Purple color
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 50 },
        2: { cellWidth: 40 },
        3: { cellWidth: 25 }
      },
      margin: { left: 20, right: 20 }
    })
    
    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages()
    const pageHeight = doc.internal.pageSize.height
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(128, 128, 128)
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.text(
        'Este es un reporte generado en modo desarrollo.',
        20,
        pageHeight - 20
      )
      doc.text(
        'Para reportes completos con gráficos, conecta con el backend de producción.',
        20,
        pageHeight - 15
      )
      doc.text(
        `Generado por SyncScope - Página ${i} de ${pageCount}`,
        20,
        pageHeight - 10
      )
    }
    
    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer')

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reporte-alertas-${new Date().getTime()}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Error generating PDF' }, { status: 500 })
  }
}
