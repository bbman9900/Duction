export default function ProfileImage({ imageUrl }) {
  const imageStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    border: "1px solid #bebebe"
  };

  return (
    <img src={imageUrl} style={imageStyle}/>
  );
}
