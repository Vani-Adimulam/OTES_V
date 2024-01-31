import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from './Service/helper';
import Pagination from 'react-js-pagination';
import { useNavigate,useLocation } from 'react-router-dom';

const PendingApprovals = () => {
  const location = useLocation();
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [pendingApprovalsStatus,setPendingApprovalsStatus] = useState("Loading Pending Approvals .Please wait...")
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const eval_email = location.state?.email;
  const navigate = useNavigate();

  useEffect(() => { 
    getPendingApprovals();
  }, []);

  const getPendingApprovals = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/pending/approvals`);
      setPendingApprovals(response.data);
      setPendingApprovalsStatus("No pending apporvals.")
    } catch (error) {
      console.log(error);
      setPendingApprovalsStatus(error.message+".Please try after some time.")
    }
  };

  const handleApprovals = async (id, decide, name) => {
    const confirmMessage = decide
      ? `Do you want to allow ${name} to write online test`
      : `Do you want to reject ${name}? And also permanently delete ${name}`;
    if (window.confirm(confirmMessage)) {
      try {
        await axios.patch(`${BASE_URL}/confirm/approval/${id}/${decide}`);
        window.location.reload(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const filteredData = searchQuery
    ? pendingApprovals.filter(item =>
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pendingApprovals;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = () => {
    setCurrentPage(1);
  };
  function handleProfileClick() {
    navigate("/myprofiledashboard", { state : { email : eval_email }});
  }

  return (
    <div style={{ marginTop: '90px' }}>
      <div className='container border border-2 rounded'>
        <div className='d-flex ' style={{display: 'flex', flexDirection: 'start', marginTop: '10px'}}>
                <button className='btn btn-warning ' style={{display: 'flex', flexDirection: 'start', backgroundColor: "#6BD8BA"}} onClick={handleProfileClick} >
                <i class="fa-solid fa-arrow-left-long"></i>
                </button>
        </div>
        <h3 className='text-center p-2'>Pending Approvals</h3>
        <hr />
        <div className='container'>  
          {pendingApprovals.length === 0 ? (
            <p className='text-center'>{pendingApprovalsStatus}</p>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <p>
                  <b>Total Pending Approvals: {filteredData.length}</b>
                </p>
                <div style={{ position: 'relative' }}>
                <input
                    type='text'
                    placeholder='Search '
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyUp={handleSearch}
                    style={{
                    outline: '1px solid #ccc',
                    borderRadius: '5px',
                    paddingLeft: '30px', // Increased padding to accommodate icon
                    }}
                />
                <i
                    className='fa fa-search'
                    style={{
                    position: 'absolute',
                    paddingTop:"8px",
                    left: '10px', // Adjust the position of the icon
                    top: '40%', // Center the icon vertically
                    transform: 'translateY(-50%)', // Center the icon vertically
                    color: '#888', // Icon color
                    }}></i>
                </div>

              </div>
              <table border={1} className='table table-hover' style={{marginTop: '10px'}}>
                <thead className='bg-info'>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Area</th>
                    <th className='text-center'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={index} id={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.area}</td>
                      <td className='text-center'>
                        <button
                          style={{ marginRight: '10px' }}
                          onClick={() =>
                            handleApprovals(item._id, true, item.name)
                          }
                          className='btn btn-primary'
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleApprovals(item._id, false, item.name)
                          }
                          className='btn btn-warning'
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                {filteredData.length === 0 && searchQuery!==""&& 'No records found.'}
              </p>
            </>
          )}

          {filteredData.length > 4 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '30px',
              }}
            >
              <div>
                Showing {indexOfFirstItem + 1} to{' '}
                {Math.min(indexOfLastItem, filteredData.length)} of{' '}
                {filteredData.length} rows
              </div>
              <div>
                <select
                  value={itemsPerPage}
                  onChange={e => {
                    const newPerPage = parseInt(e.target.value);
                    setCurrentPage(1);
                    setItemsPerPage(newPerPage);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>{' '}
                candidates per page
              </div>
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={itemsPerPage}
                totalItemsCount={filteredData.length}
                pageRangeDisplayed={5}
                onChange={setCurrentPage}
                itemClass='page-item'
                linkClass='page-link'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingApprovals;

// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { BASE_URL } from './Service/helper'
// import Pagination from "react-js-pagination";
// const PendingApprovals = () => {
//     const [pendingApprovals, setPendingApprovals] = useState([])
//     const [originalData,setOriginalData]=useState([])
//     const [searchQuery, setSearchQuery] = useState("")
//     const [pendingStatus, setPendingStatus] = useState(true)
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pendingApprovalsPerPage, setPendingApprovalsPerPage] = useState(5)
//     const indexOfLastpending = currentPage * pendingApprovalsPerPage;
//     const indexOffirstpending = indexOfLastpending - pendingApprovalsPerPage;
//     var currentPendingApprovals = pendingApprovals.slice(
//         indexOffirstpending,
//         indexOfLastpending
//     );
//     const getPendingApprovals = async () => {
//         await axios.get(`${BASE_URL}/pending/approvals`).then(res => {
//             setPendingApprovals(res.data)
//             setOriginalData(res.data)
//             setPendingStatus(false)
//         }).catch(err => console.log(err))

//     }
//     useEffect(() => {
//         getPendingApprovals()
//     }, [])
//     //for accepting or rejection of the approvals
//     const handleApprovals = async (id, decide, name) => {
//         // console.log(id)
//         console.log(id, decide, name)
//         const model = decide === true ? confirm(`Do you want to allow ${name} to write online test`) : confirm(`Do you want to reject ${name} ? And also permantly delete ${name}`)
//         console.log(model)
//         if (model === true) {
//             await axios.patch(`${BASE_URL}/confirm/approval/${id}/${decide}`)
//             window.location.reload(false)
//         }
//     }
//     var content = "No pending approvals."
//     const handleSearch = () => {
//         const filterdData=originalData.filter(item=>item.email.toLowerCase().includes(searchQuery.toLowerCase()))
//         setPendingApprovals(filterdData)
//     }
//     console.log('Rendering component')
//     return (
//         <div style={{ marginTop: "90px" }}>
//             <div className='container border border-2 rounded'>
//                 <h3 className='text-center'>Pending Approvals</h3>
//                 <hr />
//                 <div className='container'>
//                     {
//                         pendingStatus ? <p className='text-center'>Loading please wait...</p> : <>
//                             <div style={{ display: "flex", justifyContent: "space-between" }}> <p><b >Total Pending Approvals: {pendingApprovals.length}</b></p>
//                                 <div>
//                                     <input
//                                         type="text"
//                                         placeholder="Search by name or email"
//                                         value={searchQuery}
//                                         onChange={e => setSearchQuery(e.target.value)}
//                                         onKeyUp={handleSearch}
//                                         style={{outline:"1px solid #ccc",borderRadius:"5px",paddingLeft:"10px"}}
//                                     />
//                                     <i className="fa fa-search"></i>
                                    
//                                 </div>
//                             </div>
//                             <table border={1} className='table table-hover'>
//                                 <thead className='bg-info'>
//                                     <tr>
//                                         <th>S.No</th>
//                                         <th>Name</th>
//                                         <th>Email</th>
//                                         <th>Area</th>
//                                         <th className='text-center'>Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {
//                                         pendingApprovals.length > 0 ? <>
//                                             {
//                                                 currentPendingApprovals.map((item, index) => {
//                                                     return <tr key={index} id={item._id}>
//                                                         <td>{index + 1}</td>
//                                                         <td>{item.name}</td>
//                                                         <td>{item.email}</td>
//                                                         <td>{item.area}</td>
//                                                         <td className='text-center'>
//                                                             <button style={{ marginRight: "10px" }} onClick={() => handleApprovals(item._id, true, item.name)} className='btn btn-primary'>Accept</button>
//                                                             <button onClick={() => handleApprovals(item._id, false, item.name)} className='btn btn-warning'>Reject</button>
//                                                         </td>
//                                                     </tr>
//                                                 })
//                                             }
//                                         </> : null
//                                     }

//                                 </tbody>

//                             </table>
//                             <p>{pendingApprovals.length === 0 && content}</p>
//                         </>
//                     }

//                     {
//                         pendingStatus === false && pendingApprovals.length > 3 &&
//                         <div style={{ display: 'flex', justifyContent: "space-between" }}>
//                             <div style={{ display: 'flex', justifyContent: "space-between" }}>
//                                 <div>Showing {indexOffirstpending + 1} to {Math.min(indexOfLastpending, pendingApprovals.length)} of {pendingApprovals.length} rows </div>
//                                 <div>
//                                     <select
//                                         value={pendingApprovalsPerPage}
//                                         onChange={(e) => {
//                                             const newPerPage = parseInt(e.target.value);
//                                             setCurrentPage(1);
//                                             setPendingApprovalsPerPage(newPerPage);
//                                         }}
//                                     >
//                                         <option value={5}>5 </option>
//                                         <option value={10}>10 </option>
//                                         <option value={15}>15 </option>
//                                     </select> candidates per page
//                                 </div>
//                             </div>

//                             <Pagination
//                                 activePage={currentPage}
//                                 itemsCountPerPage={pendingApprovalsPerPage}
//                                 totalItemsCount={pendingApprovals.length}
//                                 pageRangeDisplayed={5}
//                                 onChange={setCurrentPage}
//                                 itemClass="page-item"
//                                 linkClass="page-link"
//                                 style={{ marginTop: "30px" }}
//                             />

//                         </div>
//                     }
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default PendingApprovals