import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'dashboard-cmp',
  moduleId: module.id,
  templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {
  public header = false;
  public columnDefs=[]
  public result = [];
  public refreshDateArray = []
  public refreshDate = ''

  constructor(private http: HttpClient) {
  }
  ngOnInit() {
    this.populateData()
    // setInterval(()=>{
    // this.populateData()
    // },10000)
  
  
  }
  populateData(){
    this.http.get('assets/csvFiles/Final_Data.csv', {responseType: 'text'})
    .subscribe(
        data => {
            let csvToRowArray = data.trim().split("\n");
            let headers=csvToRowArray[0].split(",");
            headers = headers.filter(function(str) {
              return /\S/.test(str);
          });
          this.columnDefs=[]
          for(let k=0;k<headers.length;k++){
            if(headers[k]!="" && headers[k]!=" " && headers[k].trim() != 'Refresh Time'){
              let headerObj = {
                headerName:this.MakeCamelCase(headers[k]),
                fieldName:headers[k],
                minStatus:0,
                maxStatus:0
              }
              this.columnDefs.push(headerObj)
            }
          
          }
          this.result =[];
          this.refreshDateArray = csvToRowArray[1].split(",");
          this.refreshDate = this.refreshDateArray[this.refreshDateArray.length-1]
          console.log('>>>',this.refreshDate)
            for(let i=1;i<csvToRowArray.length;i++){
              let obj = {};
              let currentline:any=csvToRowArray[i].trim().split(",");
              let minMax=this.getMaxAndMin(currentline);
              for(var j=0;j<headers.length-1;j++){
                if(headers[j]!="" && headers[j]!=" "){
                  obj[headers[j]] = currentline[j]?currentline[j]:'NA';
                }
              }
              obj['minStatus']=minMax['min'].toString();
              obj['maxStatus']=minMax['max'].toString();
              this.result.push(obj);
              
          }
        },
        error => {
            console.log(error);
        }
    );
  }
  MakeCamelCase= (str:any)=>{
    return str.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
  }
  getMaxAndMin(dataArr){
    let sample:number[]=[];
    for(let i=0;i<dataArr.length-1;i++){
      if(parseFloat(dataArr[i])){
        sample.push(parseFloat(dataArr[i]))
      }
    }
    let obj={
      min:Math.min.apply(null,sample),
      max:Math.max.apply(null,sample)
    }
    return obj;
  }

  updateTable(){
    this.populateData()
  }
}
