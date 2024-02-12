import {
  Card, CardHeader, CardBody, CardTitle, CardText,
  Table,
  Container,
  Row,
  Col,
  Button,
  Input, Label, FormGroup,
  Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'

import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const Compare = () => {
  const [user_type, setUserType] = useState(localStorage.getItem('user_type'));
  const [user_firstname, setUserFirstname] = useState();
  const [user_lastname, setUserLastname] = useState();
  const [user_year, setuseYear] = useState();
  const [user_unit, setUserUnit] = useState();
  const [id_card, setIdCarde] = useState();
  const [tel, setTel] = useState();
  const [student_id, setStudentId] = useState();
  const [id, setId] = useState();
  const [university, setUniversity] = useState();
  const [university_old, setUniversity_old] = useState();
  const [group, setGroup] = useState();
  const [branch, setBranch] = useState();
  const [items, setItems] = useState([]);
  const [item2, setItem2] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selected, setSelected] = useState('');
  const [names, setNames] = useState();
  const [itemSchool, setItemsSchool] = useState([]);
  const [itemSchool2, setItemsSchool2] = useState([]);
  const [sum, setSum] = useState(0)
  const [dates, setDates] = useState()
  const [teacher1, setTaecher1] = useState([]);
  const [teacher2, setTaecher2] = useState([]);
  const [teacher3, setTaecher3] = useState([]);
  // const [selectedOption1, setSelectedOption1] = useState([]);
  //const [selectedOption2, setSelectedOption2] = useState([]);
  // const [selectedOption3, setSelectedOption3] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [user_firstname_th, setFirstnameth] = useState();
  const [user_lastname_th, setLastnameth] = useState();

  useEffect(() => {
    let Items = sessionStorage.getItem('itemSchool2')
    setNames(sessionStorage.getItem('nameS'))
    let json = JSON.parse(Items)
    let sums = 0
    if (json[0]?.groupuniversitys[0]?.indextea != null) {
      setTeacher(json[0].groupuniversitys[0].indextea);
    }
    json.forEach((i, j) => {
      json[j].result_tc = i.groupuniversitys[0].result_tc
      if (json[j].result_tc != 'nct') {
        sums += parseInt(i.unit_university)
      }
    });

    const thaiMonths = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม'
    ];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentYaer = currentDate.getFullYear() + 543;
    const thaiMonthName = thaiMonths[currentMonth];

    let dateString = currentDay + ' ' + thaiMonthName + ' ' + currentYaer
    setDates(dateString)
    setSum(sums)
    let arr = []
    json.forEach(da => {
      console.log(da)
      if (da.result_tc != 'nct') {
        arr.push(da)
      }
    });

    setItemsSchool2(arr)
    getuserbyidData()
    getuserDataTeacher(arr)
    // setSelectedOption1()
    // setSelectedOption2()
    // setSelectedOption3()
  }, []);
  const getuserbyidData = async () => {
    let ids = localStorage.getItem('user_id')
    const response = await get_userbyid({
      id: ids,
    });
    if (localStorage.getItem('user_type') === 'admin') {
      let jsons = sessionStorage.getItem('datauser')
      let jsons2 = JSON.parse(jsons)
      response[0] = jsons2
    } else if (localStorage.getItem('user_type') === 'teacher') {
      let jsons = sessionStorage.getItem('datauser')
      let jsons2 = JSON.parse(jsons)
      response[0] = jsons2
    }

    setId(ids)
    setUserFirstname(response[0].user_firstname_th)
    setUserLastname(response[0].user_lastname_th)
    setuseYear(response[0].user_year)
    setUserUnit(response[0].user_unit)
    setIdCarde(response[0].id_card)
    setTel(response[0].tel)
    setStudentId(response[0].student_id)
    setUniversity(response[0].university)
    setBranch(response[0].branch)
    setGroup(response[0].group)
    setUniversity_old(response[0].university_old)
    setSelectedOption(response[0].university_old)


  };
  const backtomainuser = async () => {
    window.location.href = '/admin/information'
  }
  const backtomainadmin = async () => {
    window.location.href = '/admin/search'
  }
  const backtomainteacher = async () => {
    window.location.href = '/admin/rooms'
  }
  const nextpage = async () => {
    window.location.href = '/admin/compare'
  }

  const approveData = async () => {
    let Items = sessionStorage.getItem('datauser')
    let json = JSON.parse(Items)

    const response = await approveuser({
      id: parseInt(json.id),
      user_flag_ther: 1
    });
    Swal.fire('Approve Success!', '', 'success')
    setTimeout(() => {
      window.location.href = '/admin/rooms'
    }, 2000);

  };
  const getuserDataTeacher = async (arr) => {
    let users = await get_userall_teacher()

    if (arr.length != 0) {
      let Items = sessionStorage.getItem('itemSchool2')
      let json = JSON.parse(Items)
      let indextea
      if (json[0].groupuniversitys[0].indextea != null) {
        indextea = json[0].groupuniversitys[0].indextea;
        for (let i = 0; i < users.length; i++) {
          indextea.forEach(data => {
            if (parseInt(data.selectedOption) === users[i].id) {
              data.teacher = users[i].user_firstname_th + ' ' + users[i].user_lastname_th
            }
          });
        }
        setTeacher(indextea)
      }

      console.log(indextea)
    }

  };
  const captureScreen = () => {
    let printContents;
    let popupWin;

    printContents = document.getElementById("print").innerHTML.toString();
    printContents = printContents.replace("col-sm", "col-xs", "col-lg");

    popupWin = window.open("", "_blank", "top=0,left=0,height=100,width=auto,scale=0.75");
    popupWin.document.open();
    popupWin.document.write(`
    <html>
    <head>
      <title>Report</title>
      <meta name="viewport" content="width=100, initial-scale=0.75, maximum-scale=0.75, user-scalable=no">
      <link rel="stylesheet"
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      <style>
        #print {
          font-size: 1px;
        }

        .salto_pagina_despues {
          page-break-after: always;
          font-size: 10px;
        }

        .salto_pagina_anterior {
          page-break-before: always;
          font-size: 10px;
        }

        .content {
          height: 100vh;
          width: 100;
          display: flex;
          flex-direction: column;
          font-size: 10px;
        }

        .img-content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 10px;
        }

        .observation {
          height: 60px;
          overflow: hidden;
          overflow-y: auto;
          font-size: 10px;
        }
      </style>
    </head>
    <body onload="window.print();">
      ${printContents}
    </body>
  </html>
    `);
    popupWin.document.close();
  };
  return (

    <>

      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>

        </Container>
      </div>
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Card>
          <CardHeader className="bg-white border-0" >
            <Row className="align-items-center">
              <Col xs="8">
                <h3 className="mb-0">สรุปผล</h3>
              </Col>
              <Col className="text-right" xs="4">
                {/* <div className="header-body"> */}
                <Button color="success" onClick={captureScreen} > Download </Button>
                {/* </div> */}
                {user_type === 'admin' && <Button color="primary" onClick={backtomainadmin} > กลับหน้าหลัก </Button>}
                {user_type === 'user' && <Button color="primary" onClick={backtomainuser} > กลับหน้าหลัก </Button>}
                {user_type === 'teacher' && <Button color="success" onClick={approveData} > อนุมัติ </Button>}
                {user_type === 'teacher' && <Button color="primary" onClick={backtomainteacher} > กลับหน้าหลัก </Button>}
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Card className="my-2"
              style={{
                width: '80%', margin: 'auto', 'box-shadow': 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
              }}
            >
              <CardHeader>
                ข้อมูลนักศึกษา
              </CardHeader>
            </Card>
            <Row id="print" style={{
              width: '80%', margin: 'auto', 'box-shadow': 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
            }}>
              <Row style={{ "padding": "20px", "font-size": "10px !important" }}>
                <Col lg="12" style={{ "text-align": "center" }}>
                  <h3 >
                    ใบสรุปผลการเทียบโอนผลการเรียน
                  </h3>
                </Col>
                <Col lg="12" style={{ "text-align": "center" }}>
                  <h4>
                    มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา
                  </h4>
                </Col>
                <Col lg="12" style={{ "text-align": "center" }}>
                  <h4>
                    คณะ วิศวกรรมศาสตร์
                  </h4>
                </Col>
                <Table borderless>
  <thead>
    <tr>
      <td>
        1. ชื่อ - นามสกุล(นักศึกษา) : {user_firstname} {user_lastname}
      </td>
      <td>
        รหัสนักศึกษา : {student_id}
      </td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td scope="row">
        2. ชื่อหลักสูตร วิศวกรรมคอมพิวเตอร์
      </td>
      <td>
        จำนวนหน่วยกิต ตลอดหลักสูตร 135 หน่วยกิต
      </td>
    </tr>
  </tbody>

  <thead>
    <tr>
      <td colSpan="2">
        3. รายวิชาที่กรรมการพิจารณาอนุมัติผลการเทียบโอนผลการเรียนแล้วมีดังนี้
      </td>
    </tr>
  </thead>
</Table>

                {/* <Col lg="6" style={{ "text-align": "left" }}>
                  <h5>
                    1.	ชื่อ - นามสกุล(นักศึกษา) : {user_firstname} {user_lastname}
                  </h5>
                </Col>
                <Col lg="6" >
                  <h5>
                    รหัสนักศึกษา : {student_id}
                  </h5>
                </Col>
                <Col lg="6" style={{ "text-align": "left" }}>
                  <h5>
                    2.	ชื่อหลักสูตร วิศวกรรมคอมพิวเตอร์
                  </h5>
                </Col>
                <Col lg="6" >
                  <h5>
                    จำนวนหน่วยกิต ตลอดหลักสูตร 135 หน่วยกิต
                  </h5>
                </Col> */}
                {/* <Col lg="12" style={{ "text-align": "left" }}>
                  <h5>
                    3.	รายวิชาที่กรรมการพิจารณาอนุมัติผลการเทียบโอนผลการเรียนแล้วมีดังนี้
                  </h5>
                </Col> */}
              </Row>
              <Table
                bordered
                responsive
                size=""
              >
                <thead>
                  <tr>
                    <th>
                      ลำดับที่
                    </th>
                    <th>
                      รหัสวิชา
                    </th>
                    <th>
                      ชื่อวิชาในเล่มหลักสูตร
                    </th>
                    <th>
                      หน่วยกิต
                    </th>
                    <th>
                      ผล (TC/CE/CS)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {itemSchool2.map((data, idx) => (
                    <tr>
                      <th scope="row">
                        {idx + 1}
                      </th>
                      <td>
                        {data.id_university}
                      </td>
                      <td>
                        {data.name_university}
                      </td>
                      <td>
                        {data.unit_university}
                      </td>
                      <td>
                        {data.result_tc}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </Table>
              <Table borderless>
                <thead>
                  <tr>
                    
                    <td className="text-center">
                      TC = Transfer Credits CE = Credits from Examination CS = Credits from Standardized Tests
                    </td>
                  
                  </tr>
                </thead>
              </Table>

              {/* <Col lg="12" style={{ "text-align": "center", marginTop: '10px' }}>
                <h3>
                  TC = Transfer Credits CE = Credits from Examination CS = Credits from Standardized Tests
                </h3>
              </Col> */}
              <Table
                borderless
              >
                <thead>
                  <tr>
                    <td>
                      4.	จำนวนหน่วยกิตที่ต้องศึกษาอีกจำนวน .......... {135 - sum} .......... หน่วยกิต
                    </td>
                  </tr>
                  <tr>
                    <td>
                      5.	กรรมการเทียบโอนรายวิชาที่แต่งตั้งโดยคณบดี
                    </td>
                  </tr>
                </thead>

                <thead>
                  <tr>
                    {teacher.map((data, idx) => (
                      <React.Fragment key={data.id}>
                        <thead>
                          <td>
                            5.{idx + 1}. ลงชื่อ.......{data.teacher}.......วันที่ ................... {dates} ....................
                          </td>
                        </thead>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>

              </Table>
              <Row style={{ "padding": "20px" }}>
                {/* <Col lg="12" style={{ "text-align": "left" }}>
                  <h5>
                    4.	จำนวนหน่วยกิตที่ต้องศึกษาอีกจำนวน .......... {135 - sum} .......... หน่วยกิต
                  </h5>
                </Col> */}
                {/* <Col lg="12" style={{ "text-align": "left" }}>
                  <h5>
                    5.	กรรมการเทียบโอนรายวิชาที่แต่งตั้งโดยคณบดี
                  </h5>
                </Col> */}
                {/* <br></br> */}
                {/* <Col lg="12" style={{ "text-align": "left" }}>
                  {teacher.map((data, idx) => (
                    <h5 key={data.id}>
                      5.{idx + 1}	ลงชื่อ......{data.teacher}....... วันที่ ................... {dates} ....................
                    </h5>
                  ))}

                </Col> */}
              </Row>
            </Row>

          </CardBody>
        </Card>

      </Container >

    </>
  );
};
async function get_userbyid(bodys) {
  // let token = localStorage.getItem("accessToken")
  return await fetch('https://api-ii.onrender.com/system/get_userid', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodys)
  })
    .then(data => data.json())
}
async function approveuser(bodys) {
  // let token = localStorage.getItem("accessToken")
  return await fetch('https://api-ii.onrender.com/system/update_user_approve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodys)
  })
    .then(data => data.json())
}
async function get_userall_teacher() {
  // let token = localStorage.getItem("accessToken")
  return await fetch('https://api-ii.onrender.com/system/get_userall_teacher', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(data => data.json())
}

export default Compare;
