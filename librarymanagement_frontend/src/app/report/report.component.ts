import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { jsPDF } from 'jspdf';
//const html2pdf = require('html2pdf.js');
import html2canvas from 'html2canvas';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [FormsModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  returned: any[] = [];
  pieChartLabels: string[] = [];
  pieChartData: number[] = [];
  barChartLabels: string[] = [];
  barChartData: number[] = [];
  barChart: Chart | null = null;
  pieChart: Chart | null = null;
  custPaymentDueChart: Chart | null = null;
  notificationStatuses: string[] = [];
  notificationTypes: string[] = [];
  transactionStatuses: string[] = [];
  custIds: number[] = [];
  originalData: any[] = [];
  statusValue: any;
  notificationTypeValue: any;
  transactionStatusValue: any;
  bookIdValue: any;
  custIdValue: any;
  customerIds: any[] | undefined;
  yourService: any;
  readCount: number | undefined;
  unreadCount: number | undefined;
  paidCount: number | undefined;
  notPaidCount: number | undefined;
  customerCount: any;
  paymentDueCount: number | undefined;
  paymentConfirmationCount: number | undefined;
  totalcustomerCount: number = 0;
  totalReadCount: any;
  totalUnreadCount: any;
  totalPaymentConfirmationCount: any;
  totalPaymentDueCount: any;
  totalPaidCount: any;
  totalNotPaidCount: any;
  totalCustomerCount: any;
  sortField: string = ''; // Default sorting field
  sortOrder: string = 'asc'; // Default sorting order
  searchTerm: string = ''; 
  searchQuery: string = ''; // Stores the search term
  filteredReports: any[] = []; // Stores the filtered results
  reports: any;
  selectedColumn: string = ''; // Holds selected column name
  reportColumns: string[] = ['transaction_id', 'cust_id', 'due_amount', 'status']; // Update with actual column names
  reportData: any[] | undefined;
  maxRows: number |undefined; // Show all rows initially
  selectedRows: any[] = []; // Array to store selected rows
  columnValuesService: any;
  columnData: any = {};
  bookIds: any[] | undefined;
  msg: any[] = [];
  ndate: any[] = [];
  link: any[] = [];
  trans_id: any[] = [];
  ldate: any[] = [];
  due: any[] = [];
  


  constructor(private reportService: ReportService, private router: Router,private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchReport();
    this.fetchDropdownData();
    this.fetchTotalCounts();
    this.getReports();
    this.fetchReportData();
    this.columnValuesService.getColumnValues().subscribe((data: any) => {
      this.columnData = data;
    });
  }

  fetchReport(
    bookIdValue?: string,
    custIdValue?: string,
    statusValue?: string,
    notificationTypeValue?: string,
    transactionStatusValue?: string
  ) {
    this.reportService
      .getReport(bookIdValue, custIdValue, statusValue, notificationTypeValue, transactionStatusValue)
      .subscribe(
        (data) => {
          this.returned = data;
          this.reports = data;
          this.originalData = data;
          this.filteredReports = data; // Initially, show all data
          this.populateDropdowns();
          this.updateBarChart();
          this.updatePieChart();
          this.updateCustPaymentDueChart();
          this.updateNotificationTypeCount();
        },
        (error) => {
          console.error('Error fetching report data:', error);
        }
    );
  }

  // Method to toggle selection of a row
  toggleRowSelection(report: any) {
    console.log('Row selected:', report); // Debugging
    const index = this.selectedRows.indexOf(report);
    if (index === -1) {
      this.selectedRows.push(report); // Add to selectedRows
    } else {
      this.selectedRows.splice(index, 1); // Remove from selectedRows
    }
    console.log('Selected Rows:', this.selectedRows); // Debugging
    this.cdRef.detectChanges(); // Manually trigger change detection
  }
  
  // Method to select/deselect all rows
  toggleSelectAll() {
    const allSelected = this.selectedRows.length === this.filteredReports.length;
  
    // Update the 'selected' property for each report based on the current state
    this.filteredReports.forEach(report => {
      report.selected = !allSelected;  // If all rows are selected, deselect, else select all
    });
  
    // Update the selectedRows array based on the new 'selected' states
    if (!allSelected) {
      this.selectedRows = [...this.filteredReports]; // Add all to selectedRows
    } else {
      this.selectedRows = []; // Reset selectedRows array
    }
  }
  

  // Method to print selected rows or all rows if none selected
  printTable() {
    setTimeout(() => {
      const tableElement = document.querySelector('.report-table table') as HTMLTableElement;
      if (!tableElement) {
        console.error('Table not found');
        return;
      }

      // Clone the table
      const clonedTable = tableElement.cloneNode(true) as HTMLTableElement;

      // Remove unselected rows using Angular's data binding
      const allRows = clonedTable.querySelectorAll('tbody tr');
      let hasSelectedRow = false;

      allRows.forEach((row, index) => {
        if (!this.filteredReports[index].selected) {
          row.remove();
        } else {
          hasSelectedRow = true;
        }
      });

      // If no rows remain, show an error and return
      if (!hasSelectedRow) {
        console.error('No rows selected');
        alert('No rows selected for printing.');
        return;
      }

      // Create a temporary container for the cloned table
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px'; // Hide it from view
      tempDiv.appendChild(clonedTable);
      document.body.appendChild(tempDiv); // Append it to the DOM temporarily

      // Convert to canvas and save as PDF
      html2canvas(clonedTable).then((canvas) => {
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 10, 10, 180, 0);
        pdf.save('selected_report.pdf');

        // Remove the temporary table from the DOM
        document.body.removeChild(tempDiv);
      }).catch((error) => {
        console.error('Error capturing table:', error);
        alert('Error generating PDF. Please try again.');
        document.body.removeChild(tempDiv);
      });

    }, 1000);
  }


  fetchReportData() {
    const query = this.searchQuery.toLowerCase();
    if (!query) {
      this.filteredReports = this.returned.slice(0, this.maxRows); // Limit rows
      return;
    }
  
    this.filteredReports = this.returned
      .filter((report) =>
        Object.values(report).some((value: any) =>
          typeof value === 'string' || typeof value === 'number'
            ? value.toString().toLowerCase().includes(query)
            : false
        )
      )
      .slice(0, this.maxRows); // Apply row limit after filtering
  }
  

  
  updateSearchBox() {
    this.searchQuery = ''; // Reset search query when column is changed
    this.filterReports(); // Apply filtering when selection changes
  }

  getReports() {
    this.reportService.getReport().subscribe((data) => {
      this.returned = data;
      this.maxRows = data.length;
      this.filteredReports = this.returned.slice(0, this.maxRows); // Initially, show all reports
    });
  }

  filterTable() {
    this.returned = this.originalData.filter((report: any) => {
      return Object.values(report).some((value: unknown) => 
        typeof value === 'string' && value.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }
  
  

  sortReports() {
    if (!this.sortField) {
      console.warn('No field selected for sorting.');
      return;
    }
  
    if (!this.sortOrder) {
      this.sortOrder = 'asc'; // Default to ascending if not selected
    }
  
    this.filteredReports.sort((a, b) => {
      let valueA = a[this.sortField];
      let valueB = b[this.sortField];
  
      // Convert to lowercase for string sorting
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
  
      // Convert to numbers if applicable
      if (!isNaN(valueA) && !isNaN(valueB)) {
        valueA = parseFloat(valueA);
        valueB = parseFloat(valueB);
      }
  
      return this.sortOrder === 'asc' ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
    });
  }
  
  
  resetMaxRows() {
    this.maxRows = this.returned.length; // Reset to show all rows
    this.filterReports(); // Reapply filtering with the full set of rows
  }
  

  fetchTotalCounts() {
    this.reportService.getTotalCounts().subscribe(
      (data) => {
        this.totalReadCount = data.totalread;
        this.totalUnreadCount = data.totalunread;
        this.totalPaymentConfirmationCount = data.totalpaymentconfirmation;
        this.totalPaymentDueCount = data.totalpaymentdue;
        this.totalPaidCount = data.totalpaid;
        this.totalNotPaidCount = data.totalnotpaid;
        this.totalCustomerCount = data.totalcustomers;
      },
      (error) => {
        console.error('Error fetching total counts:', error);
      }
    );
  }

  fetchDropdownData() {
    this.reportService.getDistinctNotificationStatus().subscribe((data) => {
      this.notificationStatuses = data;
    });
    this.reportService.getDistinctNotificationType().subscribe((data) => {
      this.notificationTypes = data;
    });
    this.reportService.getDistinctTransactionStatus().subscribe((data) => {
      this.transactionStatuses = data;
    });
    this.reportService.getDistinctCustomerIds().subscribe((data) => {
      this.custIds = data;
    });
  }

  applyFilters() {
    this.fetchReport(
      this.bookIdValue,
      this.custIdValue,
      this.statusValue,
      this.notificationTypeValue,
      this.transactionStatusValue
    );
  }
  

  resetFilters() {
    this.bookIdValue = '';
    this.custIdValue = '';
    this.statusValue = '';
    this.notificationTypeValue = '';
    this.transactionStatusValue = '';
    this.fetchReport();
  }

  populateDropdowns() {
    this.notificationStatuses = [...new Set(this.originalData.map(item => item.notification_status))];
    this.notificationTypes = [...new Set(this.originalData.map(item => item.notification_type))];
    this.transactionStatuses = [...new Set(this.originalData.map(item => item.transaction_status))];
    this.custIds = [...new Set(this.originalData.map(item => item.cust_id))];
    this.bookIds = [...new Set(this.originalData.map(item => item.book_id))];
    this.customerCount = [...new Set(this.returned.map(item => item.cust_id))].length;

    //----------------------------------------------
    this.msg = [...new Set(this.originalData.map(item => item.message))];
    this.ndate = [...new Set(this.originalData.map(item => item.notification_date))];
    this.link = [...new Set(this.originalData.map(item => item.action_link))];
    this.trans_id = [...new Set(this.originalData.map(item => item.transaction_id))];
    this.ldate = [...new Set(this.originalData.map(item => item.lending_date))];
    this.due = [...new Set(this.originalData.map(item => item.due_amount))];





  }

  onFilterChange() {
    let filteredData = this.originalData;

    if (this.custIdValue) {
      filteredData = filteredData.filter(item => item.cust_id == this.custIdValue);
    }
    if (this.statusValue) {
      filteredData = filteredData.filter(item => item.notification_status == this.statusValue);
    }
    if (this.notificationTypeValue) {
      filteredData = filteredData.filter(item => item.notification_type == this.notificationTypeValue);
    }
    if (this.transactionStatusValue) {
      filteredData = filteredData.filter(item => item.transaction_status == this.transactionStatusValue);
    }

    this.notificationStatuses = [...new Set(filteredData.map(item => item.notification_status))];
    this.notificationTypes = [...new Set(filteredData.map(item => item.notification_type))];
    this.transactionStatuses = [...new Set(filteredData.map(item => item.transaction_status))];
    this.custIds = [...new Set(filteredData.map(item => item.cust_id))];
  }



  filterReports() {
    const query = this.searchQuery.toLowerCase();
  
    if (!query) {
      this.filteredReports = this.returned; // Reset to original data
      return;
    }
  
    if (this.selectedColumn) {
      // Filter only the selected column
      this.filteredReports = this.returned.filter((report) =>
        report[this.selectedColumn]?.toString().toLowerCase().includes(query)
      );
    } else {
      // Default behavior: Filter across all columns
      this.filteredReports = this.returned.filter((report) =>
        Object.values(report).some((value: any) =>
          typeof value === 'string' || typeof value === 'number'
            ? value.toString().toLowerCase().includes(query)
            : false
        )
      );
    }
  }
   
  
  

  
  fetchCustomerIds() {
    this.yourService.getCustomerIds().subscribe((ids: number[]) => {
      this.custIds = ids;
    }, (error: any) => {
      console.error("Error fetching customer IDs", error);
    });
  }

  updatePieChart() {
    // Initialize counts for "Read" and "Unread"
    const notificationCounts = { Read: 0, Unread: 0 };
  
    // Loop through the returned data to count "Read" and "Unread" statuses
    this.returned.forEach((report) => {
      const status = report.notification_status;  // Check the notification_status field
      if (status === 'Read') notificationCounts.Read++;
      if (status === 'Unread') notificationCounts.Unread++;
    });
  
    // Set the chart labels and data based on the counts
    this.pieChartLabels = Object.keys(notificationCounts);
    this.pieChartData = Object.values(notificationCounts);
  
    // Set the total counts to be displayed below the chart
    this.readCount = notificationCounts.Read;
    this.unreadCount = notificationCounts.Unread;
  
    // Destroy the existing chart if it exists
    if (this.pieChart) this.pieChart.destroy();
  
    // Create a new pie chart with the updated data
    this.pieChart = new Chart('pieCanvas', {
      type: 'pie',
      data: {
        labels: this.pieChartLabels,
        datasets: [
          {
            label: 'Notification Status Count',
            data: this.pieChartData,
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Notification Status Distribution' },
        },
      },
    });
  }
    
  printReport() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  
    const filterContent = document.querySelector('.report-filter') as HTMLElement;
    const reportContent = document.querySelector('.report-table') as HTMLElement;
  
    // Convert filter content (summary table)
    doc.html(filterContent, {
      callback: (doc) => {
        // Check if reportContent exists before adding a new page
        if (reportContent) {
  
          // Convert report table (only if it exists)
          doc.html(reportContent, {
            callback: () => {
              doc.save('report.pdf'); // Save the final PDF
            },
            x: 10,
            y: 10,
            width: 190,
            windowWidth: document.body.scrollWidth
          });
        } else {
          doc.save('report.pdf'); // Save if there's no report content
        }
      },
      x: 10,
      y: 10,
      width: 190,
      windowWidth: document.body.scrollWidth
    });
  }
  

  downloadPageAsPDF(){
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  
    const filterContent = document.querySelector('.full-page') as HTMLElement;
    const reportContent = document.querySelector('.full-page') as HTMLElement;
  
    // Convert filter content (summary table)
    doc.html(filterContent, {
      callback: (doc) => {
        // Check if reportContent exists before adding a new page
        if (reportContent) {
  
          // Convert report table (only if it exists)
          doc.html(reportContent, {
            callback: () => {
              doc.save('full-page.pdf'); // Save the final PDF
            },
            x: 10,
            y: 10,
            width: 190,
            windowWidth: document.body.scrollWidth
          });
        } else {
          doc.save('full-page.pdf'); // Save if there's no report content
        }
      },
      x: 10,
      y: 10,
      width: 190,
      windowWidth: document.body.scrollWidth
    });
  }
  
  

  updateBarChart() {
    const transactionCounts = { Paid: 0, 'Not Paid': 0 };
    this.returned.forEach((report) => {
      const status = report.transaction_status;
      if (status === 'Paid') transactionCounts.Paid++;
      if (status === 'Not Paid') transactionCounts['Not Paid']++;
    });
  
    this.barChartLabels = Object.keys(transactionCounts);
    this.barChartData = Object.values(transactionCounts);
  
    // Set the total counts to be displayed below the chart
    this.paidCount = transactionCounts.Paid;
    this.notPaidCount = transactionCounts['Not Paid'];
  
    // Destroy and create the bar chart
    if (this.barChart) this.barChart.destroy();
  
    this.barChart = new Chart('barCanvas', {
      type: 'bar',
      data: {
        labels: this.barChartLabels,
        datasets: [
          {
            label: 'Transaction Status Count',
            data: this.barChartData,
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true } },
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Transaction Status Distribution' },
        },
      },
    });
  }

  
  updateCustPaymentDueChart() {
    const paymentDueCounts: { [key: string]: { amount: number; transactionStatus: string } } = {};
    let paidCount = 0;
    let notPaidCount = 0;
  
    this.returned.forEach((report) => {
      const custId = report.cust_id;
      const paymentDue = report.due_amount;
      const transactionStatus = report.transaction_status;
  
      if (!paymentDueCounts[custId]) {
        paymentDueCounts[custId] = { amount: 0, transactionStatus: 'Not Paid' };
      }
  
      paymentDueCounts[custId].amount += paymentDue;
      if (transactionStatus === 'Paid') {
        paymentDueCounts[custId].transactionStatus = 'Paid';
        paidCount++;
      } else {
        notPaidCount++;
      }
    });
  
    const custIds = Object.keys(paymentDueCounts);
    const paymentDueValues = custIds.map((id) => paymentDueCounts[id].amount);
    const backgroundColors = custIds.map((id) =>
      paymentDueCounts[id].transactionStatus === 'Paid'
        ? 'rgba(75, 192, 192, 0.6)'
        : 'rgba(255, 99, 132, 0.6)'
    );
  
    // Set the total counts to be displayed below the chart
    this.paidCount = paidCount;
    this.notPaidCount = notPaidCount;
  
    if (this.custPaymentDueChart) this.custPaymentDueChart.destroy();
  
    this.custPaymentDueChart = new Chart('custTransactionCanvas', {
      type: 'bar',
      data: {
        labels: custIds,
        datasets: [
          {
            label: 'Total Payment Due',
            data: paymentDueValues,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) => color.replace('0.6', '1')),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true } },
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Customer Payment Due Status' },
        },
      },
    });
  }  
  
  
  updateNotificationTypeCount() {
    const notificationTypeCounts: { [key: string]: number } = { 'Payment Due': 0, 'Payment Confirmation': 0 };
  
    this.returned.forEach((report) => {
      const notificationType = report.notification_type;
  
      if (notificationType === 'Payment Due') {
        notificationTypeCounts['Payment Due']++;
      } else if (notificationType === 'Payment Confirmation') {
        notificationTypeCounts['Payment Confirmation']++;
      }
    });
  
    // Set the total notification type counts to be displayed
    this.paymentDueCount = notificationTypeCounts['Payment Due'];
    this.paymentConfirmationCount = notificationTypeCounts['Payment Confirmation'];
  }
  
}