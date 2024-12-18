import '@styles/components/Labels.css'

export default function IconPlusLabel({icon, text, onClick}) {
  return (
    <div className='iconPlusLabel' onClick={onClick}>
      <img
        className='iconPlusLabel_icon'
        src={icon} 
        alt={text} 
        width={40}
        height={40}
      />
      <span className='iconPlusLabel_text'>{text}</span>
    </div>
  )
}
