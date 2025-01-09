import '@styles/components/HeaderFooter.css'
import IconPlusLabel from './Labels/IconPlusLabel'
import PreCaptionLabel from './Labels/PreCaptionLabel'
import PreTextLabel from './Labels/PreTextLabel';

export default function Footer() {
  const openWeb = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className='footer_container'>
      <div className='footer_container_logo'>
        <PreTextLabel text="덕션"/>
      </div>
      <div className='footer_container_center'>
        <PreCaptionLabel text={'Duck-Family @ 2024-2025. All rights reserved.'} />
      </div>
      <div className='footer_container_links'>
        <IconPlusLabel icon={'/assets/gitLogo.png'} onClick={()=>openWeb('https://github.com/bbman9900/Ducktion')}/>
        <IconPlusLabel icon={'/assets/notion.png'} onClick={()=>openWeb('https://www.notion.so/154bc0f6983880f0b6b9f88e3fe2ec8d')} />
      </div>
    </div>
  )
}