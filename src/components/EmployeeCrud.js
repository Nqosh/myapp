import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { format } from 'date-fns';


function EmployeeCrud() {

    // Modal Handlers 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [createshow, setCreateShow] = useState(false);
    const handleCreateClose = () => setCreateShow(false);
    const handleCreateShow = () => setCreateShow(true);
   
    const[employeeNum,setEmployeeNum] = useState('');
    const[firstName,setFirstName] = useState('');
    const[lastName,setLastName] = useState('');
    const[birthDate,setBirthDate] = useState(new Date());
  
    const[editId,setEditId] = useState('');
    const[editemployeeNum,setEditEmployeeNum] = useState('');
    const[editfirstName,setEditFirstName] = useState('');
    const[editlastName,setEditLastName] = useState('');
    const[editbirthDate,setEditBirthDate] = useState('');


const [data,setData] = useState();

  useEffect(() =>{
    getData();
    clear();
    // toast.success('Employee has been added');
  },[])

  const getData = async () =>  {
     await axios.get("https://localhost:7050/Employee/GetEmployees", {mode:'no-cors'})
    .then((result)=> {
      result.data.forEach(element => {
        const formattedDate = format(new Date(element.person.birthDate), 'yyyy-MM-dd');
        element.person.birthDate = formattedDate;
      });
      setData(result.data)
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    })
  }


  const getEmployeeById =(id) => {
     axios.get(`https://localhost:7050/Employee/${id}`)
     .then((result)=> {
      const formattedDate = format(new Date(result.data.person.birthDate), 'yyyy-MM-dd');
      setEditEmployeeNum(result.data.employeeNum)
      setEditFirstName(result.data.person.firstName)
      setEditLastName(result.data.person.lastName)
      setEditBirthDate(formattedDate)
      setEditId(id);
      handleShow();
    })
    .catch((error) => {
      console.log(error);
    })
  }

  const handleDelete =(id) => {
   
    if(window.confirm("Are you sure you want to delete this employee") === true){
       axios.delete(`https://localhost:7050/Employee/${id}`)
       .then((result) => {
          if(result.status === 200) {
            // toast.success('Employee has been succesfully deleted');
            getData();
          }
       })
    }
  }

  const handleUpdate = () => {

  }

  const handleCreate = () => {
    const url = 'https://localhost:7050/Employee/CreateEmployee';
    const data = {
      "firstName": firstName,
      "lastName": lastName,
      "employeeNum": employeeNum,
      "birthDate": birthDate
    }
    axios.post(url, data)
      .then((result) => {
        getData();
      }).catch((error) => {
        console.log(error);
      })
  }

  const handleSave = () => {
    handleCreateShow();
  }

  const clear = () => {
    setFirstName('');
    setLastName('');
    setBirthDate('');
    setEmployeeNum('');
    setEditEmployeeNum('');
    setEditFirstName('');
    setEditLastName('');
    setEditBirthDate('');

  }
 
    return (
      <Fragment>
       <h4>Employee Management</h4>
        <Table striped bordered hover variant="light">
      <thead>
        <tr>
          <th>#</th>
          <th>EmployeeNum</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Birth Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {
          data && data.length > 0 ?
          data.map((item,index) =>{
            return (
              <tr key= {index}>
                <td>{item.id}</td>
                <td>{item.employeeNum}</td>
                <td>{item.person.firstName}</td>
                <td>{item.person.lastName}</td>
                <td>{item.person.birthDate}</td>
                <td colSpan={2}>
                  <button className="btn btn-primary" onClick={() => getEmployeeById(item.id)}>Edit</button>|
                  <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>          
                </td>
              </tr>
            )
          })
          : 'No Data...'
        }
      </tbody>
      <br/>
      <tfoot>
      <button className="btn btn-success" onClick={() => handleSave()}>Create Employee</button>
      </tfoot>
    </Table>
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="container mt-4">
        <form>
        <div className="form-group">
   
        <input type="text" class="form-control" placeholder="Enter Employee Number"
        value={editemployeeNum} onChange={(event) => setEditEmployeeNum(event.target.value)}
        />
        <br/>
        <input type="text" class="form-control" placeholder="Enter First Name"
        value={editfirstName} onChange={(event) => setEditFirstName(event.target.value)}
        />
         <br/>
        <input type="text" class="form-control" placeholder="Enter Last Name"
        value={editlastName} onChange={(event) => setEditLastName(event.target.value)}
        />
         <br/>
        <input type="text" class="form-control" placeholder="Enter Birth Date e.g"
          value={editbirthDate} onChange={(event) => setEditBirthDate(event.target.value)}
        />
        <br/>
    </div>
    </form>
    </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="btn btn-primary" onClick={handleUpdate}>
            Update 
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={createshow} onHide={handleCreateClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="container mt-4">
        <form>
        <div className="form-group">
   
        <input type="text" class="form-control" placeholder="Enter Employee Number"
        value={employeeNum} onChange={(event) => setEmployeeNum(event.target.value)}
        />
        <br/>
        <input type="text" class="form-control" placeholder="Enter First Name"
        value={firstName} onChange={(event) => setFirstName(event.target.value)}
        />
         <br/>
        <input type="text" class="form-control" placeholder="Enter Last Name"
        value={lastName} onChange={(event) => setLastName(event.target.value)}
        />
         <br/>
        <input type="text" class="form-control" placeholder="Enter Birth Date (yy-mm-dd)"
          value={birthDate} onChange={(event) => setBirthDate(event.target.value)}
        />
        <br/>
    </div>
    </form>
    </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCreateClose}>
            Close
          </Button>
          <Button variant="success"  onClick={handleCreate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>     
      </Fragment>
      )
}
  
  export default EmployeeCrud;