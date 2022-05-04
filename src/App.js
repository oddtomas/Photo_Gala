import React, { useState, useEffect } from "react";
import "./App.css";
import Modal from "./components/Modal";


const clientID = `?client_id=${process.env.REACT_APP_KEY}`; //api key from .env
const mainUrl = `https://api.unsplash.com/photos/`; 

function App() {
  const [loading, setLoading] = useState(false); //loading state
  const [photos, setPhotos] = useState([]); //photos state
  const [page, setPage] = useState(0); //page state

  useEffect(() => { //useEffect to fetch photos upon mounting
    fetchImages(); 
  }, [page]); //only fetch when page changes

  const fetchImages = async () => { 
    setLoading(true); 
    let url; 
    const urlPage = `&page=${page}`; //add page to url

    url = `${mainUrl}${clientID}${urlPage}`; //add clientID to url

    const response = await fetch(url); //fetch url
    const data = await response.json(); //parse response to json
    console.log("data", data); //log data for reference
    setPhotos((oldPhotos) => { 
      if (page === 1) { 
        return data.results;  
      } else {  
        return [...oldPhotos, ...data];  
      }
    });
    setLoading(false); 
  };

  useEffect(() => {
    const event = window.addEventListener("scroll", () => { //add scroll event listener
      if (
        (!loading && window.innerHeight + window.scrollY) >= //if scroll is at bottom of page
        document.body.scrollHeight - 2 //-2 to account for scrollbar
      ) {
        setPage((oldPage) => { //set page to next page
          return oldPage + 1;
        });
      }
    });

    return () => window.removeEventListener("scroll", event); 
  }, []);

  const [clickedImage, setClickedImage] = useState(null); //clicked image state
  const [currentIndex, setCurrentIndex] = useState(null); //current index state

  const expandImg = (image, index) => { //onClick function to set states to pass to Modal component
    setCurrentIndex(index); 
    setClickedImage(image.urls.regular);

  }

  const handleRotationRight = () => { //onClick function to rotate image to the right
    const totalLength = photos.length; //get total length of photos
    if (currentIndex + 1 >= totalLength) { //if current index is at end of photos
      setCurrentIndex(0); 
      const newUrl = photos[0].urls.regular; //set new url to first photo
      setClickedImage(newUrl); //set clicked image to new url
      return; 
    }
    const newIndex = currentIndex + 1; //set new index
    const newUrl = photos.filter((item) => { //filter photos to get new url
      return photos.indexOf(item) === newIndex; 
    });
    const newItem = newUrl[0].urls.regular; //set new url
    setClickedImage(newItem); //set clicked image to new url
    setCurrentIndex(newIndex); //set current index
  };

  const handleRotationLeft = () => { //onClick function to rotate image to the left (same as above but in reverse)
    const totalLength = photos.length;
    if (currentIndex === 0) {
      setCurrentIndex(totalLength - 1);
      const newUrl = photos[totalLength - 1].urls.regular;
      setClickedImage(newUrl);
      return;
    }
    const newIndex = currentIndex - 1;
    const newUrl = photos.filter((item) => {
      return photos.indexOf(item) === newIndex;
    });
    const newItem = newUrl[0].urls.regular;
    setClickedImage(newItem);
    setCurrentIndex(newIndex);
  };

  return (
    <>



      <div className="grid">
        {photos.map((image, index) => ( //map over photos 
          <div key={index} className="" > 

            <img
              src={image.urls.regular}
              alt="Image"
              onClick={() => expandImg(image, index)}
            />


          </div>
        ))}
      </div>
      <div> 
        {clickedImage && (<Modal clickedImage={clickedImage} setClickedImage={setClickedImage} 
          handleRotationRight={handleRotationRight}
          handleRotationLeft={handleRotationLeft}

        />
        )}
      </div>

    </>
  );
}

export default App;