
new Vue({
    el: '#app',
    data: {
        date: new Date(),
        month: (new Date()).getMonth(),
        year: (new Date()).getFullYear(),
        response: {
            error: true,
            data: {},
            availability: [],
            message: '',
            loading: true,
        },
        schedules: {
            route: 5,
            schedule: 0,
            options: [
                { text: 'Circuit 1 - Machu Picchu Mountain Route', value: 1, slots: [
                        'All schedules',
                        '07:00 AM - 08:00 AM',
                        '09:00 AM - 10:00 AM'
                        ]},   // 375
                { text: 'Circuit 1 - Upper Terrace Route', value: 2, slots: [
                        'All schedules',
                        '06:00 AM - 07:00 AM',
                        '07:00 AM - 08:00 AM',
                        '08:00 AM - 09:00 AM',
                        '09:00 AM - 10:00 AM',
                        '10:00 AM - 11:00 AM',
                        '11:00 AM - 12:00 AM',
                        '12:00 AM - 01:00 PM',
                        '01:00 PM - 02:00 PM',
                        '02:00 PM - 03:00 PM',
                        '03:00 PM - 04:00 PM'
                        ]},           // 376
                { text: 'Circuit 1 - Intipunku Gateway Route', value: 3, slots: [
                        'All schedules',
                        '08:00 AM - 09:00 AM',
                        '09:00 AM - 10:00 AM',
                        '10:00 AM - 11:00 AM',
                        '11:00 AM - 12:00 AM'
                        ]},       // 377
                { text: 'Circuit 1 - Inka Bridge Route', value: 4, slots: [
                        'All schedules',
                        '08:00 AM - 09:00 AM',
                        '09:00 AM - 10:00 AM',
                        '10:00 AM - 11:00 AM',
                        '11:00 AM - 12:00 AM'
                        ]},             // 378
                { text: 'Circuit 2 - Classic Designed Route', value: 5, slots: [
                        'All schedules',
                        '06:00 AM - 07:00 AM',
                        '07:00 AM - 08:00 AM',
                        '08:00 AM - 09:00 AM',
                        '09:00 AM - 10:00 AM',
                        '10:00 AM - 11:00 AM',
                        '11:00 AM - 12:00 AM',
                        '12:00 AM - 01:00 PM',
                        '01:00 PM - 02:00 PM',
                        '02:00 PM - 03:00 PM',
                        '03:00 PM - 04:00 PM'
                        ]},        // 379
                { text: 'Circuit 2 - Lower Terrace Route', value: 6, slots: [
                        'All schedules',
                        '06:00 AM - 07:00 AM',
                        '07:00 AM - 08:00 AM',
                        '08:00 AM - 09:00 AM',
                        '09:00 AM - 10:00 AM',
                        '10:00 AM - 11:00 AM',
                        '11:00 AM - 12:00 AM',
                        '12:00 AM - 01:00 PM',
                        '01:00 PM - 02:00 PM',
                        '02:00 PM - 03:00 PM',
                        '03:00 PM - 04:00 PM'
                        ]},           // 380
                { text: 'Circuit 3 - Huayna Picchu Route', value: 7, slots: [
                        'All schedules',
                        '07:00 AM - 08:00 AM',
                        '09:00 AM - 10:00 AM'
                        ]},           // 381
                { text: 'Circuit 3 - Royalty Designed Route', value: 8, slots: [
                        'All schedules',
                        '06:00 AM - 07:00 AM',
                        '07:00 AM - 08:00 AM',
                        '08:00 AM - 09:00 AM',
                        '09:00 AM - 10:00 AM',
                        '10:00 AM - 11:00 AM',
                        '11:00 AM - 12:00 AM',
                        '12:00 AM - 01:00 PM',
                        '01:00 PM - 02:00 PM',
                        '02:00 PM - 03:00 PM',
                        '03:00 PM - 04:00 PM'
                        ]},        // 382
                { text: 'Circuit 3 - Great Cavern Route', value: 9, slots: [
                        'All schedules',
                        '07:00 AM - 08:00 AM',
                        '09:00 AM - 10:00 AM'
                        ]},            // 383
                { text: 'Circuit 3 - Huchuy Picchu Route', value: 10, slots: [
                        'All schedules',
                        '10:00 AM - 1:00 AM',
                        '12:00 AM - 01:00 PM'
                        ]}           // 384
            ],
            selectedIndex: 5,
            selectedSlot: 0,
        },
        myFromPage: null, 
        currentPage: null,
        API_KEY: '',
        ORIGIN_DOMAIN:''
    },
    created() {
        // this.getData();
        // console.log(this.date);
        // this.startAll(this.schedules.route,(this.month+1),this.year);
        // this.getData(this.route,(this.date.getMonth()+1),this.date.getFullYear());
    },
    mounted() {
        // get data from widget
        window.addEventListener('message', this.receiveMessage, false);
        // Initialize the counter to 0
        this.spaces_by_day = 0;
    },
    methods: {
        receiveMessage(event) {
        //   if (event.origin !== 'https://machupicchuapi.com') {
        //     console.error('Unauthorized domain');
        //     return;
        //   }
    
          this.ORIGIN_DOMAIN = event.origin;
          this.API_KEY = event.data.apiKey;
          
          if(this.ORIGIN_DOMAIN == null || this.ORIGIN_DOMAIN == ''){
              this.response.error = true;
              this.response.message = 'ERROR_DOMAIN';
              return;
          }
          //start to get data
          this.startAll(this.schedules.route,(this.month+1),this.year);
        //   console.log('Main Domain:', this.ORIGIN_DOMAIN);
        //   console.log('API Key:', this.API_KEY);
    
          // Now you can make a request to your API to validate the API key and the origin
        },
        onDayClick(day) {
            console.log(day.date);
        },
        pageChange(page) {
            // console.log(page)
            this.myFromPage = page;
            this.currentPage = page;
            
            this.startAll(this.schedules.route,page.month,page.year);
        },
        onScheduleChange(selectedSlot){
            console.log("Schedule:"+selectedSlot);
            this.response.loading = true;
            this.schedules.selectedSlot = selectedSlot;
            
            // if(this.schedules.selectedSlot == 0){
                
            //     const result = this.summarizeData(this.response.data[0].data);
            //     this.response.data.availability = result;
            //     //console.log(this.response.data[0].availability);
            // } else {
            //     const result = this.getDataBySchedule(this.response.data[0].data,this.schedules.selectedSlot);
            //     this.response.data.availability = result;
            //     //console.log(this.response.data[0].availability);
            // }
            this.response.loading = false;
        },
        onRouteChange(selectedIndex) {
            
            console.log("Route:"+this.schedules.route);
            // console.log("Month:"+this.currentPage.month);
            // console.log("Year:"+this.currentPage.year);
            this.response.error = true;
            
            this.schedules.selectedIndex = selectedIndex;
            
            this.startAll(this.schedules.route,(this.currentPage.month+1),this.currentPage.year);
        },
        async startAll(route,month,year){
            // Verify if we have data in the last 30 minutes
            // if yes: get data from our server
            if (this.ORIGIN_DOMAIN && this.API_KEY) {
              this.getData(route, month, year);
            } else {
                this.response.error = true;
                this.response.loading = false;
                this.response.message = 'ERROR_DOMAIN_OR_APIKEY';
              console.error('Missing DOMAIN or API_KEY');
            }
        },
        getFormattedDate(year, month) {
            // Month is zero-indexed, so subtract 1
            const date = new Date(year, month - 1, 1);
            
            const formattedYear = date.getFullYear();
            const formattedMonth = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-indexed
        
            return `${formattedYear}-${formattedMonth}-01`;
        },
        async getData(ticket_id, month, year) {
            this.response.loading = true;
            const date_send = this.getFormattedDate(year, month);
            const bodyContent = `apikey=${this.API_KEY}&route=${ticket_id}&date=${date_send}&origin_domain=${this.ORIGIN_DOMAIN}`;
        
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://api.machupicchuapi.com/v3/machu-picchu/", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
…