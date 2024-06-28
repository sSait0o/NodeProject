import React from 'react'
import './HomeSection.scss'
import { useTranslation } from 'react-i18next'
import restaurantInfo from '../../data/restaurantInfo.json'

const HomeSection = () => {
  const { t } = useTranslation()

  return (
    <section id={t('home')} className="home__section">
      <div className="home__container">
        <h1 className="home__title">{restaurantInfo.name}</h1>
        <p className="home__note">{restaurantInfo.note}</p>
      </div>
    </section>
  )
}

export default HomeSection