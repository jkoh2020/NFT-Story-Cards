import React, { useState, useContext, useEffect } from 'react';
// import * as waxjs from '@waxio/waxjs/dist';
import axios from 'axios';
import { withUAL } from 'ual-reactjs-renderer';

import AuthenticationContext from '../components/context/Authentication';

const Login = (props) => {
  const { authenticate } = useContext(AuthenticationContext);
  const [banner, setBanner] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
   
      getBanners();
    
  }, []);

  const getBanners = async () => {
   await axios.get('/banners').then((response) => {
     let arr =[]
     arr = response.data
    arr.forEach(element => {
      if(element.showBanner == true){
        console.log("True Value find in banner:::" , element)
        setBanner(element)
      }
    })
  })
  
};

  const openBanner = () => {

    window.open(
      process.env.REACT_APP_API_URL + '/uploads/' + banner?.image ,
      '_blank' // <- This is what makes it open in a new window.
    );
  }
  const loginHandler = async () => {
    await props.ual.showModal();

    // if (props.ual.activeUser.accountName) {
    //   axios.post('/login').then((res) => {
    //     authenticate({
    //       userAccount: props.ual.activeUser.accountName,
    //       publicKey: props.ual.activeUser.pubKeys[0],
    //       token: res.data.token,
    //     });
    //   });
    // }
  };


  // const loginHandler = async () => {
  //   const wax = new waxjs.WaxJS('https://wax.greymass.com', null, null, false);
  //   try {
  //     let uAccount = await wax.login();
  //     let pubKeys = wax.pubKeys;

  //     axios.post('/login').then((res) => {
  //       authenticate({
  //         userAccount: uAccount,
  //         publicKey: pubKeys[0],
  //         token: res.data.token,
  //       });
  //     });
  //   } catch (e) {
  //     setError('Failed to login, please try again.');
  //   }
  // };

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col">
        <h1 className="text-6xl text-white uppercase">
          Welcome to NFT Story Cards
        </h1>
        <button
          onClick={loginHandler}
          className="mt-6 bg-secondary py-3 px-6 w-24 self-center rounded-md text-white uppercase"
        >
          Login
        </button>
        
            <div className="mt-12 flex flex-wrap justify-center ">
              <div className="rounded-lg w-80 mx-14 mb-12 flex-initial relative">
                <div className="absolute w-full h-full rounded-xl  flex justify-center items-center transition ">
                  <button
                    className="border-2 border-white rounded-xl uppercase text-white py-3 px-6 focus:outline-non"
                    onClick={() => openBanner()}
                    // onClick={() => push(`/banner/${banner._id}`)}
                  >
                    Open Grapic Link
                  </button>
                </div>
                <img
                 className="rounded-t-xl w-full h-96"
                  src={
                    process.env.REACT_APP_API_URL + '/uploads/' + banner?.image
                  }
               
                   title={
                    process.env.REACT_APP_API_URL + '/uploads/' + banner?.image
                
                  } 
                  
                  alt=""
                 
                />
                <div className="h-16 bg-secondary rounded-b-xl text-white uppercase flex justify-center items-center">
                  <p className="hover:text-gray-300">{banner.bannername}</p>
                </div>
             
              </div>
            </div>
        
        {error}
      </div>
    </div>



  );
};

export default withUAL(Login);
