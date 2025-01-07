import '@styles/components/Labels.css'

export default function GodoTitleLabel({text, onClick}) {
  return (
  <>
    <div className='titleLabelGodo' onClick={onClick}>{text}</div>
  </>)
}