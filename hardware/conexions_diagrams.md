# Mapeo de pines del ESP32 DevKit V1

En este archivo se desglosa la arquitectura física del guante inteligente con el fin de definir el mapeo de pines del *ESP32 DevKit V1* para asegurar la correcta lectura de los sensores de flexión y el acelerómetro/giroscopio (MPU-6050).

| Componente | Pin ESP32 | Notas |
| - | - | - |
| Flex Pulgar | GPIO34 | ADC |
| Flex Índice | GPIO35 | ADC |
| Flex Medio | GPIO32 | ADC |
| Flex Anular | GPIO33 | ADC |
| Flex Meñique | GPIO25 | ADC |
| MPU SDA | GPIO21 | I2C |
| MPU SCL | GPIO22 | I2Cl |

---

## Diagrama de conexiones

```mermaid
graph TD

    ESP32[ESP32]

    S1[Flex Pulgar]
    S2[Flex Índice]
    S3[Flex Medio]
    S4[Flex Anular]
    S5[Flex Meñique]

    MPU[MPU-6050]

    VCC[3.3V]
    GND[GND]

    S1 -->|GPIO34 ADC| ESP32
    S2 -->|GPIO35 ADC| ESP32
    S3 -->|GPIO32 ADC| ESP32
    S4 -->|GPIO33 ADC| ESP32
    S5 -->|GPIO25 ADC| ESP32

    VCC --> S1
    VCC --> S2
    VCC --> S3
    VCC --> S4
    VCC --> S5

    MPU -->|SDA GPIO21| ESP32
    MPU -->|SCL GPIO22| ESP32
    VCC --> MPU
    GND --> MPU

    GND --> S1
    GND --> S2
    GND --> S3
    GND --> S4
    GND --> S5
```

Cada sensor flex utiliza un divisor de voltaje con resistencia de 10kΩ a GND.
