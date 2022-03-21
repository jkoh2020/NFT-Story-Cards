import axios from 'axios';
import React, { useRef, useState , useEffect } from 'react';

const AddLoginBanner = () => {

    useEffect(() => {

      axios.get('/banners').then((response) => {
          setbanners(response.data);
        });
      }, []); 


    const [banners, setbanners] = useState([]);
    const [formData, setFormData] = useState({
        image: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        image: '',
    });
    
    const getAllBanners = async () => {
      axios.get('/banners').then((response) => {
        setbanners(response.data);
      });
    };
    const handleUploadBanner = (e) => {
        e.preventDefault();
        if (handleValidations()) {
            let data = new FormData();
            data.append('image', formData.image);
            data.append('bannername' , formData.image.name);

            axios.post('/admin/addbanner', data).then(() => {
                alert('Login Banner added succesfully.');
            }); 
        }
    };
    const doUpdatedBannerAsFalse = async (dobannerasFalse , dobannerasTrue)=> {
      console.log("updatebannerAsFalse in Frontend Handlebannerselect function:", dobannerasFalse)
     await axios.put('/updatebannerAsFalse/', dobannerasFalse).then(() => {
        console.log("Last Banner Is Removed From Login Page!")
        doUpdatedBannerAsTrue(dobannerasTrue);
      });
    };
    const doUpdatedBannerAsTrue = async (dobannerasTrue)=>{
      console.log("updatedbannerAsTrue in Frontend Handlebannerselect function:" , dobannerasTrue)
      await axios.put('/updatebannerAsTrue/' , dobannerasTrue).then(() => {
            console.log("Current Banner is Saved on Login Page!")
            getAllBanners();
            alert("BannerUpdated Successfully!")
          });
    };
    const handlebannerSelect = (banner) => {
        let bannerAlreadyExistsonLoginPage = false
        banners.forEach(element => {
          if (element.showBanner === true) {
            bannerAlreadyExistsonLoginPage = true
            console.log("Inside loop end::::" , bannerAlreadyExistsonLoginPage)
           doUpdatedBannerAsFalse(element , banner)
          } else {}
        })
        console.log("outside loop end::::" , bannerAlreadyExistsonLoginPage)
        if(!bannerAlreadyExistsonLoginPage){
          doUpdatedBannerAsTrue(banner)
          
        }
        console.log("At the end of loop end::::" , bannerAlreadyExistsonLoginPage)
     //  console.log("loop end::::")
       // getAllBanners();
     //  doUpdatedBannerAsTrue(banner);
       //getAllBanners();
    };
    const handleValidations = () => {
      console.log("handlevalidations")
      let resolve = true;

      const { image } = formData;
      let messages = {};
      if (!image) {
          resolve = false;
          messages.image = 'Image is required!';
      }

      setErrorMessages({ errorMessages, ...messages });

      return resolve;
    };


    return (
        <>
        <form
            className="flex flex-col w-6/12 mx-auto mt-24"
            onSubmit={handleUploadBanner}
        >
            <h2 className="mb-20 text-white text-3xl uppercase">
                Add a New Login Banner
            </h2>
            <input
                type="file"
                className=""
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            // value={formData.image}
            />
            <div className="text-red-700 mt-2">{errorMessages.image}</div>
            <button
                className="bg-secondary py-4 px-10 mt-6 rounded-lg uppercase text-white focus:outline-none"
                onClick={handleUploadBanner}
            >
                Add Login Banner
            </button>
        </form>

        <div className="mt-36">
        <div className="mx-36">
          <h2 className="text-5xl uppercase text-white text-center">
            Uploaded Login Banners List
          </h2>
        </div>

        <div className="mt-12 flex flex-wrap justify-center ">
          {banners.map((banner, index) => {
            return (
              <div className="rounded-lg w-80 mx-14 mb-12 flex-initial relative">
                <div className="absolute w-full h-full rounded-xl hover:bg-black hover:bg-opacity-80 hover:opacity-100 opacity-0 cursor-pointer flex justify-center items-center transition duration-500 ease-in-out">
                  <button
                    className="border-2 border-white rounded-xl uppercase text-white py-3 px-6 focus:outline-none bg-gray-800 transition duration-500 ease-in-out"
                    onClick={() => handlebannerSelect(banner)}
                    // onClick={() => push(`/banner/${banner._id}`)}
                  >
                    Add Banner
                  </button>
                </div>
                <img
                 className="rounded-t-xl w-full h-96"
                  src={
                    process.env.REACT_APP_API_URL + '/uploads/' + banner.image
                  }
               
                  title={
                    process.env.REACT_APP_API_URL + '/uploads/' + banner.image
                
                  }
                  
                  alt=""
                 
                />
                <div className="h-16 bg-secondary rounded-b-xl text-white uppercase flex justify-center items-center">
                  <p className="hover:text-gray-300">{banner.bannername}</p>
                </div>
             

              </div>
               
            );
        
          })}
          
        </div>
        <div className="flex justify-center">
          <button className="text-white uppercase text-center cursor-pointer bg-secondary rounded-lg px-6 py-3 focus:outline-none">
            View More
          </button>
        </div>
      </div>
        </>
    );
};

export default AddLoginBanner;
