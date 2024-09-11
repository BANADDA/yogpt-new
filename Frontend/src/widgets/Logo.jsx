// Logo.js

const Logo = () => {
  return (
    <div style={{
      background: '#004d40', // dark green background
      color: 'white', // white text color
      borderRadius: '50%', // makes the div circular
      width: '50px', // set the width of the circle
      height: '50px', // set the height of the circle
      display: 'flex', // use flexbox for centering
      alignItems: 'center', // center vertically
      justifyContent: 'center', // center horizontally
      fontSize: '15px', // size of the text
      fontWeight: 'bold', // make the font bold
      fontFamily: 'Arial, sans-serif' // font styling
    }}>
      YOGPT
    </div>
  );
}

export default Logo;
