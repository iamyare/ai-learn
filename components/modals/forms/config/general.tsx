import React from 'react'
import { Header } from '../header'

export default function GeneralConfig() {
  return (
    <section className=' flex flex-col gap-2'>
      <Header.Container>
        <Header.Title>Configuración de la Cuenta</Header.Title>
        <Header.Description>
          Administra y personaliza la configuración de tu cuenta para mejorar tu
          experiencia.
        </Header.Description>
      </Header.Container>
      <span>hola</span>
    </section>
  )
}
