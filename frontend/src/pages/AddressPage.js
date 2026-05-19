import React, { useEffect } from 'react'
import Address from '../features/address/Components/Address'
import { useNavigate } from 'react-router-dom';
import useUserData from '../hooks/useUserData';

const AddressPage = () => {
  document.title = "Your Saved Address";

  const {userData:user} = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    if(!user) {
      navigate("/login?redirect=/address");
    }
  }, [navigate, user])

  return (
    user && <Address />
  )
}

export default AddressPage