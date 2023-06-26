import { useEffect, useState } from "react";
import Vectors from "../../../common/Vectors";

const UserImage = ({ photos, size }) => {
  const [img, setImg] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const getImg = async () => {
      if (!photos || !photos[0]?.url) return;

      try {
        const img = await fetch(photos[0]?.url);
        if (img.status === 200) {
          const image = await img.blob();
          setImg(URL.createObjectURL(image));
        } else {
          setImgError(true);
        }
      } catch (error) {
        setImgError(true);
      }
    };

    getImg();
  }, []);

  return (
    <>
      {imgError ? (
        <Vectors.user />
      ) : (
        <img
          style={{
            width: size + " px !important",
            height: size + " px !important",
          }}
          alt="user avatar"
          src={img}
        />
      )}
    </>
  );
};

export default UserImage;
