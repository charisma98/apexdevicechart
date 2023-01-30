import React from "react";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import * as XLSX from "xlsx";
import ExcelFile from "./data/export-device-417D96-messages.xlsx";

class ApexChart1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      changed: "unchanged",
      series: [
        {
          data: [],
        },
      ],
      options: {
        chart: {
          id: "area-datetime",
          type: "area",
          height: 350,
          zoom: {
            autoScaleYaxis: true,
          },
        },
        annotations: {
          //   yaxis: [
          //     {
          //       y: 30,
          //       borderColor: "#999",
          //       label: {
          //         show: true,
          //         text: "Support",
          //         style: {
          //           color: "#fff",
          //           background: "#00E396",
          //         },
          //       },
          //     },
          //   ],
          //   xaxis: [
          //     {
          //       x: new Date("01 Oct 2022").getTime(),
          //       borderColor: "#999",
          //       yAxisIndex: 0,
          //       label: {
          //         show: true,
          //         text: "Rally",
          //         style: {
          //           color: "#fff",
          //           background: "#775DD0",
          //         },
          //       },
          //     },
          //   ],
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
          style: "hollow",
        },
        xaxis: {
          type: "datetime",
          //   min: new Date("31 Sep 2022").getTime(),
          min: 1664580118000,
          tickAmount: 6,
        },
        tooltip: {
          x: {
            format: "dd MMM yyyy hh:mm:ss",
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100],
          },
        },
      },

      selection: "one_year",
    };
  }

  readExcel = async (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, {
          type: "buffer",
          dateNF: "YYYY-MM-DD",
          cellDates: true,
          cellNF: false,
          cellText: true,
        });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        console.log(data);
        console.log(e.target.result);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    await promise.then(async (d) => {
      //   setItems(d);
      await d.map((items) => {
        this.setState({
          data: this.state.series[0].data.push([
            new Date(items.Timestamp).getTime(),
            Math.round(items.temperature * 10) / 10,
          ]),
        });
        // temp.push([
        //   new Date(items.Timestamp).getTime(),
        //   Math.round(items.temperature * 10) / 10,
        // ]);
      });
      //   const myJson = { data: temp };
      //   console.log("MyJson>>>", myJson);
      //   //   TemDdata = JSON.parse(myJson);
      //   //   console.log("temp>>>", TemDdata);
      //   this.setState({
      //     series: this.state.series.push(1),
      //   });

      console.log("data>>>", this.state.series[0].data);
    });
    this.setState({
      changed: "changed",
    });
    console.log(this.state.changed);
  };

  //   componentDidMount() {
  //     const fileReader = new FileReader();
  //     fileReader.readAsArrayBuffer(ExcelFile);

  //     fileReader.onload = (e) => {
  //       const bufferArray = e.target.result;

  //       const wb = XLSX.read(bufferArray, { type: "buffer" });

  //       const wsname = wb.SheetNames[0];

  //       const ws = wb.Sheets[wsname];

  //       const data = XLSX.utils.sheet_to_json(ws);

  //       console.log(data);
  //       console.log(ExcelFile.bufferArray);
  //       // resolve(data);
  //     };
  //   }

  updateData(timeline) {
    this.setState({
      selection: timeline,
    });

    switch (timeline) {
      case "one_month":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date("01 Oct 2022").getTime(),
          new Date("01 Nov 2022").getTime()
        );
        break;
      case "six_months":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date("01 Oct 2022").getTime(),
          new Date("01 Apr 2023").getTime()
        );
        break;
      case "one_year":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date("01 Jan 2022").getTime(),
          new Date("01 Jan 2023").getTime()
        );
        break;
      case "ytd":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date("01 Jan 2022").getTime(),
          new Date("01 Jan 2022").getTime()
        );
        break;
      case "all":
        ApexCharts.exec(
          "area-datetime",
          "zoomX",
          new Date("01 Jan 2022").getTime(),
          new Date("01 Feb 2023").getTime()
        );
        break;
      default:
    }
  }

  render() {
    return (
      <div id="chart">
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            this.readExcel(file);
            console.log("file>>> ", file);
          }}
        />
        <div className="toolbar">
          <button
            id="one_month"
            onClick={() => this.updateData("one_month")}
            className={this.state.selection === "one_month" ? "active" : ""}>
            1M
          </button>
          &nbsp;
          <button
            id="six_months"
            onClick={() => this.updateData("six_months")}
            className={this.state.selection === "six_months" ? "active" : ""}>
            6M
          </button>
          &nbsp;
          <button
            id="one_year"
            onClick={() => this.updateData("one_year")}
            className={this.state.selection === "one_year" ? "active" : ""}>
            1Y
          </button>
          &nbsp;
          <button
            id="ytd"
            onClick={() => this.updateData("ytd")}
            className={this.state.selection === "ytd" ? "active" : ""}>
            YTD
          </button>
          &nbsp;
          <button
            id="all"
            onClick={() => this.updateData("all")}
            className={this.state.selection === "all" ? "active" : ""}>
            ALL
          </button>
        </div>

        <div id="chart-timeline">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    );
  }
}

export default ApexChart1;
