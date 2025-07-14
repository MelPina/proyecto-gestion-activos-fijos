/**
 * Valida si una cédula dominicana es válida
 * @param cedula Cédula a validar (con o sin guiones)
 * @returns true si la cédula es válida, false en caso contrario
 */
export const validationCedula = (cedula: string): boolean => {
  const cleanCedula = cedula.replace(/[-\s]/g, "")

  if (!/^\d{11}$/.test(cleanCedula)) return false

  if (cleanCedula === "00000000000") return false
  if (/^(\d)\1{10}$/.test(cleanCedula)) return false

  const digits = cleanCedula.substring(0, 10).split("").map(Number)
  const lastDigit = Number(cleanCedula.charAt(10))
  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]

  const sum = digits.reduce((acc, digit, index) => {
    let product = digit * weights[index]
    if (product >= 10) {
      product = Math.floor(product / 10) + (product % 10)
    }
    return acc + product
  }, 0)

  const remainder = sum % 10
  const checkDigit = remainder === 0 ? 0 : 10 - remainder

  return checkDigit === lastDigit
}

  
  /**
   * Formatea una cédula agregando guiones
   * @param cedula Cédula sin formato
   * @returns Cédula formateada (XXX-XXXXXXX-X)
   */
  export const formatCedula = (cedula: string): string => {
    const cleanCedula = cedula.replace(/[-\s]/g, "")
    if (cleanCedula.length === 11) {
      return `${cleanCedula.substring(0, 3)}-${cleanCedula.substring(3, 10)}-${cleanCedula.substring(10)}`
    }
    return cedula
  }
  