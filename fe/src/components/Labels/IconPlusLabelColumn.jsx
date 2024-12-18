import '@styles/components/Labels.css'

export default function IconPlusLabelColumn({icon, text, onClick}) {
  return (
    <div className='iconPlusLabelColumn' onClick={onClick}>
      <img 
        className='iconPlusLabelColumn_icon'
        src={icon} 
        alt={text} 
        width={40}
        height={40}
      />
      <span className='iconPlusLabelColumn_text'>{text}</span>
    </div>
  )
}
