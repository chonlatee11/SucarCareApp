import React, { createContext, useState } from "react";
export const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
  const [photo, setPhoto] = useState({
    uri: "",
    type: "",
    name: "",
  });
  const [ispicture, setIspicture] = useState(false);
  const [predict, setPredict] = useState({
    status_code: "",
    probability: "",
    predicted_label: "",
  });
  const [usecamera, setUsecamera] = useState(false);
  const [usegallerry, setUsegallerry] = useState(false);

  const Photo = (uri, type, name) => {
    setPhoto({
      uri: uri,
      type: type,
      name: name,
    });
  };

  const IsPicture = (ispicture) => {
    setIspicture(ispicture);
  };

  const UseCamera = (usecamera) => {
    setUsecamera(usecamera);
  };

  const UseGallerry = (usegallerry) => {
    setUsegallerry(usegallerry);
  };

  const SetPredict = (status_code, probability, predicted_label) => {
    setPredict({
      status_code: status_code,
      probability: probability,
      predicted_label: predicted_label,
    });
  };

  return (
    <PhotoContext.Provider
      value={{
        Photo,
        photo,
        ispicture,
        IsPicture,
        SetPredict,
        predict,
        UseCamera,
        usecamera,
        UseGallerry,
        usegallerry,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
};
