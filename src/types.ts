export interface Password {
  id: string
  title: string      
  subTitle: string
  secure: string
  from: string
  type: string
  createAt: number
}

export interface SVGButton {
  width: number
  height: number
  fill?: string
  [key: string]: any
}