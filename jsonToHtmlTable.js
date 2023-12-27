function jsonToHtmlTable(jsonData) {
    // Create a table element
    var table = document.createElement('table');

    // Create a header row
    var headerRow = table.insertRow(0);

    // Add headers based on the keys in the JSON data
    for (var key in jsonData[0]) {
        var headerCell = headerRow.insertCell(-1);
        headerCell.innerHTML = key;
    }

    // Add data rows
    for (var i = 0; i < jsonData.length; i++) {
        var dataRow = table.insertRow(-1);

        // Add cells with data
        for (var key in jsonData[i]) {
            var cell = dataRow.insertCell(-1);
            cell.innerHTML = jsonData[i][key];
        }
    }

    return table.outerHTML;
}
var jsonData = ' ""data"": {
    ""supSearchMpn"": {
      ""hits"": 2805,
      ""results"": [
        {
          ""part"": {
            ""mpn"": ""R5F51303ADFL#30"",
            ""manufacturer"": {
              ""name"": ""Renesas""
            },
            ""specs"": [
              {
                ""attribute"": {
                  ""name"": ""Case/Package""
                },
                ""displayValue"": ""LFQFP""
              },
              {
                ""attribute"": {
                  ""name"": ""Core Architecture""
                },
                ""displayValue"": ""RXv1""
              },
              {
                ""attribute"": {
                  ""name"": ""Data Bus Width""
                },
                ""displayValue"": ""32 b""
              },
              {
                ""attribute"": {
                  ""name"": ""Frequency""
                },
                ""displayValue"": ""32 MHz""
              },
              {
                ""attribute"": {
                  ""name"": ""Interface""
                },
                ""displayValue"": ""I2C, SCI, SPI""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Operating Temperature""
                },
                ""displayValue"": ""85 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Supply Voltage""
                },
                ""displayValue"": ""5.5 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Size""
                },
                ""displayValue"": ""64 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Type""
                },
                ""displayValue"": ""FLASH""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Operating Temperature""
                },
                ""displayValue"": ""-40 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Supply Voltage""
                },
                ""displayValue"": ""1.8 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Pins""
                },
                ""displayValue"": ""48""
              },
              {
                ""attribute"": {
                  ""name"": ""RAM Size""
                },
                ""displayValue"": ""10 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""RoHS""
                },
                ""displayValue"": ""Non-Compliant""
              },
              {
                ""attribute"": {
                  ""name"": ""Schedule B""
                },
                ""displayValue"": ""8542310000""
              }
            ]
          }
        },
        {
          ""part"": {
            ""mpn"": ""R7FS7G27H3A01CFC#AA0"",
            ""manufacturer"": {
              ""name"": ""Renesas""
            },
            ""specs"": [
              {
                ""attribute"": {
                  ""name"": ""Ambient Temperature Range High""
                },
                ""displayValue"": ""105 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Case/Package""
                },
                ""displayValue"": ""LQFP""
              },
              {
                ""attribute"": {
                  ""name"": ""Core Architecture""
                },
                ""displayValue"": ""ARM""
              },
              {
                ""attribute"": {
                  ""name"": ""Data Bus Width""
                },
                ""displayValue"": ""32 b""
              },
              {
                ""attribute"": {
                  ""name"": ""Frequency""
                },
                ""displayValue"": ""240 MHz""
              },
              {
                ""attribute"": {
                  ""name"": ""Height""
                },
                ""displayValue"": ""1.7 mm""
              },
              {
                ""attribute"": {
                  ""name"": ""Interface""
                },
                ""displayValue"": ""CAN, Ethernet, I2C, IrDA, SCI, SPI, UART, USB""
              },
              {
                ""attribute"": {
                  ""name"": ""Lead Free""
                },
                ""displayValue"": ""Lead Free""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Junction Temperature (Tj)""
                },
                ""displayValue"": ""125 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Operating Temperature""
                },
                ""displayValue"": ""105 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Supply Voltage""
                },
                ""displayValue"": ""3.6 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Size""
                },
                ""displayValue"": ""4 MB""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Type""
                },
                ""displayValue"": ""FLASH""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Operating Temperature""
                },
                ""displayValue"": ""-40 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Supply Voltage""
                },
                ""displayValue"": ""2 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of A/D Converters""
                },
                ""displayValue"": ""2""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of ADC Channels""
                },
                ""displayValue"": ""21""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Ethernet Channels""
                },
                ""displayValue"": ""2""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of I2C Channels""
                },
                ""displayValue"": ""3""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of I/Os""
                },
                ""displayValue"": ""126""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Pins""
                },
                ""displayValue"": ""176""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of PWM Channels""
                },
                ""displayValue"": ""14""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of SPI Channels""
                },
                ""displayValue"": ""2""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Timers/Counters""
                },
                ""displayValue"": ""16""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of UART Channels""
                },
                ""displayValue"": ""10""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of USB Channels""
                },
                ""displayValue"": ""2""
              },
              {
                ""attribute"": {
                  ""name"": ""Oscillator Type""
                },
                ""displayValue"": ""Internal""
              },
              {
                ""attribute"": {
                  ""name"": ""Peripherals""
                },
                ""displayValue"": ""DMA, LCD, LVD, POR, PWM, WDT""
              },
              {
                ""attribute"": {
                  ""name"": ""RAM Size""
                },
                ""displayValue"": ""640 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""RoHS""
                },
                ""displayValue"": ""Compliant""
              }
            ]
          }
        },
        {
          ""part"": {
            ""mpn"": ""R7FA2A1AB3CFJ#AA0"",
            ""manufacturer"": {
              ""name"": ""Renesas""
            },
            ""specs"": [
              {
                ""attribute"": {
                  ""name"": ""Case/Package""
                },
                ""displayValue"": ""LQFP""
              },
              {
                ""attribute"": {
                  ""name"": ""Data Bus Width""
                },
                ""displayValue"": ""32 b""
              },
              {
                ""attribute"": {
                  ""name"": ""Flash Memory Size""
                },
                ""displayValue"": ""8 kB, 256 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""Frequency""
                },
                ""displayValue"": ""48 MHz""
              },
              {
                ""attribute"": {
                  ""name"": ""Height""
                },
                ""displayValue"": ""1.7 mm""
              },
              {
                ""attribute"": {
                  ""name"": ""Interface""
                },
                ""displayValue"": ""CAN""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Operating Temperature""
                },
                ""displayValue"": ""105 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Supply Voltage""
                },
                ""displayValue"": ""5.5 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Size""
                },
                ""displayValue"": ""256 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Type""
                },
                ""displayValue"": ""FLASH""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Operating Temperature""
                },
                ""displayValue"": ""-40 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Supply Voltage""
                },
                ""displayValue"": ""1.6 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of A/D Converters""
                },
                ""displayValue"": ""1""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of ADC Channels""
                },
                ""displayValue"": ""5""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of I2C Channels""
                },
                ""displayValue"": ""2""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of I/Os""
                },
                ""displayValue"": ""17""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Pins""
                },
                ""displayValue"": ""32""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of PWM Channels""
                },
                ""displayValue"": ""6""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of SPI Channels""
                },
                ""displayValue"": ""2""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Timers/Counters""
                },
                ""displayValue"": ""6""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of UART Channels""
                },
                ""displayValue"": ""1""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of USB Channels""
                },
                ""displayValue"": ""1""
              },
              {
                ""attribute"": {
                  ""name"": ""RAM Size""
                },
                ""displayValue"": ""32 kB""
              }
            ]
          }
        },
        {
          ""part"": {
            ""mpn"": ""R5F51136ADFM#3A"",
            ""manufacturer"": {
              ""name"": ""Renesas""
            },
            ""specs"": [
              {
                ""attribute"": {
                  ""name"": ""Case/Package""
                },
                ""displayValue"": ""LFQFP""
              },
              {
                ""attribute"": {
                  ""name"": ""Core Architecture""
                },
                ""displayValue"": ""RXv1""
              },
              {
                ""attribute"": {
                  ""name"": ""Data Bus Width""
                },
                ""displayValue"": ""32 b""
              },
              {
                ""attribute"": {
                  ""name"": ""Frequency""
                },
                ""displayValue"": ""32 MHz""
              },
              {
                ""attribute"": {
                  ""name"": ""Interface""
                },
                ""displayValue"": ""I2C, IrDA, SCI""
              },
              {
                ""attribute"": {
                  ""name"": ""Lead Free""
                },
                ""displayValue"": ""Lead Free""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Operating Temperature""
                },
                ""displayValue"": ""85 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Supply Voltage""
                },
                ""displayValue"": ""3.6 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Size""
                },
                ""displayValue"": ""256 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Type""
                },
                ""displayValue"": ""FLASH""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Operating Temperature""
                },
                ""displayValue"": ""-40 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Supply Voltage""
                },
                ""displayValue"": ""1.8 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of I/Os""
                },
                ""displayValue"": ""44""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Pins""
                },
                ""displayValue"": ""64""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of USB Channels""
                },
                ""displayValue"": ""1""
              },
              {
                ""attribute"": {
                  ""name"": ""Oscillator Type""
                },
                ""displayValue"": ""Internal""
              },
              {
                ""attribute"": {
                  ""name"": ""Peripherals""
                },
                ""displayValue"": ""DMA, LCD, LVD, POR, PWM, WDT""
              },
              {
                ""attribute"": {
                  ""name"": ""RAM Size""
                },
                ""displayValue"": ""32 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""RoHS""
                },
                ""displayValue"": ""Compliant""
              }
            ]
          }
        },
        {
          ""part"": {
            ""mpn"": ""R5F52316CDFL#30"",
            ""manufacturer"": {
              ""name"": ""Renesas""
            },
            ""specs"": [
              {
                ""attribute"": {
                  ""name"": ""Case/Package""
                },
                ""displayValue"": ""LFQFP""
              },
              {
                ""attribute"": {
                  ""name"": ""Core Architecture""
                },
                ""displayValue"": ""RXv2""
              },
              {
                ""attribute"": {
                  ""name"": ""Data Bus Width""
                },
                ""displayValue"": ""32 b""
              },
              {
                ""attribute"": {
                  ""name"": ""Frequency""
                },
                ""displayValue"": ""54 MHz""
              },
              {
                ""attribute"": {
                  ""name"": ""Interface""
                },
                ""displayValue"": ""I2C, SCI, SPI""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Operating Temperature""
                },
                ""displayValue"": ""85 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Supply Voltage""
                },
                ""displayValue"": ""5.5 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Size""
                },
                ""displayValue"": ""256 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Type""
                },
                ""displayValue"": ""FLASH""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Operating Temperature""
                },
                ""displayValue"": ""-40 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Supply Voltage""
                },
                ""displayValue"": ""1.8 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of I/Os""
                },
                ""displayValue"": ""30""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Pins""
                },
                ""displayValue"": ""48""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of USB Channels""
                },
                ""displayValue"": ""1""
              },
              {
                ""attribute"": {
                  ""name"": ""Oscillator Type""
                },
                ""displayValue"": ""Internal""
              },
              {
                ""attribute"": {
                  ""name"": ""Peripherals""
                },
                ""displayValue"": ""DMA, LVD, POR, PWM, WDT""
              },
              {
                ""attribute"": {
                  ""name"": ""RAM Size""
                },
                ""displayValue"": ""32 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""RoHS""
                },
                ""displayValue"": ""Compliant""
              }
            ]
          }
        },
        {
          ""part"": {
            ""mpn"": ""R5F51403ADFL#30"",
            ""manufacturer"": {
              ""name"": ""Renesas""
            },
            ""specs"": [
              {
                ""attribute"": {
                  ""name"": ""Case/Package""
                },
                ""displayValue"": ""LFQFP""
              },
              {
                ""attribute"": {
                  ""name"": ""Core Architecture""
                },
                ""displayValue"": ""RXv2""
              },
              {
                ""attribute"": {
                  ""name"": ""Data Bus Width""
                },
                ""displayValue"": ""32 b""
              },
              {
                ""attribute"": {
                  ""name"": ""Frequency""
                },
                ""displayValue"": ""48 MHz""
              },
              {
                ""attribute"": {
                  ""name"": ""Interface""
                },
                ""displayValue"": ""I2C, SCI, SPI""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Supply Voltage""
                },
                ""displayValue"": ""5.5 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Size""
                },
                ""displayValue"": ""64 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Type""
                },
                ""displayValue"": ""FLASH""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Supply Voltage""
                },
                ""displayValue"": ""1.8 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Pins""
                },
                ""displayValue"": ""48""
              },
              {
                ""attribute"": {
                  ""name"": ""RAM Size""
                },
                ""displayValue"": ""16 kB""
              }
            ]
          }
        },
        {
          ""part"": {
            ""mpn"": ""R5F51403ADFM#30"",
            ""manufacturer"": {
              ""name"": ""Renesas""
            },
            ""specs"": [
              {
                ""attribute"": {
                  ""name"": ""Case/Package""
                },
                ""displayValue"": ""LFQFP""
              },
              {
                ""attribute"": {
                  ""name"": ""Core Architecture""
                },
                ""displayValue"": ""RXv2""
              },
              {
                ""attribute"": {
                  ""name"": ""Data Bus Width""
                },
                ""displayValue"": ""32 b""
              },
              {
                ""attribute"": {
                  ""name"": ""Frequency""
                },
                ""displayValue"": ""48 MHz""
              },
              {
                ""attribute"": {
                  ""name"": ""Interface""
                },
                ""displayValue"": ""I2C, SCI, SPI""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Supply Voltage""
                },
                ""displayValue"": ""5.5 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Size""
                },
                ""displayValue"": ""64 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Type""
                },
                ""displayValue"": ""FLASH""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Supply Voltage""
                },
                ""displayValue"": ""1.8 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Pins""
                },
                ""displayValue"": ""64""
              },
              {
                ""attribute"": {
                  ""name"": ""RAM Size""
                },
                ""displayValue"": ""16 kB""
              }
            ]
          }
        },
        {
          ""part"": {
            ""mpn"": ""R5F51136ADFP#3A"",
            ""manufacturer"": {
              ""name"": ""Renesas""
            },
            ""specs"": [
              {
                ""attribute"": {
                  ""name"": ""Case/Package""
                },
                ""displayValue"": ""LFQFP""
              },
              {
                ""attribute"": {
                  ""name"": ""Core Architecture""
                },
                ""displayValue"": ""RXv1""
              },
              {
                ""attribute"": {
                  ""name"": ""Data Bus Width""
                },
                ""displayValue"": ""32 b""
              },
              {
                ""attribute"": {
                  ""name"": ""Frequency""
                },
                ""displayValue"": ""32 MHz""
              },
              {
                ""attribute"": {
                  ""name"": ""Interface""
                },
                ""displayValue"": ""I2C, IrDA, SCI""
              },
              {
                ""attribute"": {
                  ""name"": ""Lead Free""
                },
                ""displayValue"": ""Lead Free""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Operating Temperature""
                },
                ""displayValue"": ""85 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Supply Voltage""
                },
                ""displayValue"": ""3.6 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Size""
                },
                ""displayValue"": ""256 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Type""
                },
                ""displayValue"": ""FLASH""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Operating Temperature""
                },
                ""displayValue"": ""-40 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Supply Voltage""
                },
                ""displayValue"": ""1.8 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of I/Os""
                },
                ""displayValue"": ""80""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Pins""
                },
                ""displayValue"": ""100""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of USB Channels""
                },
                ""displayValue"": ""1""
              },
              {
                ""attribute"": {
                  ""name"": ""Oscillator Type""
                },
                ""displayValue"": ""Internal""
              },
              {
                ""attribute"": {
                  ""name"": ""Peripherals""
                },
                ""displayValue"": ""DMA, LCD, LVD, POR, PWM, WDT""
              },
              {
                ""attribute"": {
                  ""name"": ""RAM Size""
                },
                ""displayValue"": ""32 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""RoHS""
                },
                ""displayValue"": ""Compliant""
              },
              {
                ""attribute"": {
                  ""name"": ""Schedule B""
                },
                ""displayValue"": ""8542310000""
              }
            ]
          }
        },
        {
          ""part"": {
            ""mpn"": ""R5F563TEEDFA#V0"",
            ""manufacturer"": {
              ""name"": ""Renesas""
            },
            ""specs"": [
              {
                ""attribute"": {
                  ""name"": ""Case/Package""
                },
                ""displayValue"": ""LQFP""
              },
              {
                ""attribute"": {
                  ""name"": ""Data Bus Width""
                },
                ""displayValue"": ""32 b""
              },
              {
                ""attribute"": {
                  ""name"": ""Frequency""
                },
                ""displayValue"": ""100 MHz""
              },
              {
                ""attribute"": {
                  ""name"": ""Interface""
                },
                ""displayValue"": ""EBI/EMI, I2C, LIN, SCI, SPI, UART, USB""
              },
              {
                ""attribute"": {
                  ""name"": ""Lead Free""
                },
                ""displayValue"": ""Lead Free""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Frequency""
                },
                ""displayValue"": ""100 MHz""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Operating Temperature""
                },
                ""displayValue"": ""85 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Size""
                },
                ""displayValue"": ""512 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Type""
                },
                ""displayValue"": ""FLASH""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Operating Temperature""
                },
                ""displayValue"": ""-40 °C""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of I/Os""
                },
                ""displayValue"": ""72""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Pins""
                },
                ""displayValue"": ""120""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Programmable I/O""
                },
                ""displayValue"": ""93""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Timers/Counters""
                },
                ""displayValue"": ""20""
              },
              {
                ""attribute"": {
                  ""name"": ""Operating Supply Voltage""
                },
                ""displayValue"": ""3 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Oscillator Type""
                },
                ""displayValue"": ""Internal""
              },
              {
                ""attribute"": {
                  ""name"": ""Peripherals""
                },
                ""displayValue"": ""DMA, LVD, POR, PWM, WDT""
              },
              {
                ""attribute"": {
                  ""name"": ""Radiation Hardening""
                },
                ""displayValue"": ""No""
              },
              {
                ""attribute"": {
                  ""name"": ""RAM Size""
                },
                ""displayValue"": ""48 kB""
              },
              {
                ""attribute"": {
                  ""name"": ""RoHS""
                },
                ""displayValue"": ""Compliant""
              },
              {
                ""attribute"": {
                  ""name"": ""Schedule B""
                },
                ""displayValue"": ""8542310000""
              },
              {
                ""attribute"": {
                  ""name"": ""Watchdog Timer""
                },
                ""displayValue"": ""Yes""
              }
            ]
          }
        },
        {
          ""part"": {
            ""mpn"": ""R7F7016843AFP-C#AA1"",
            ""manufacturer"": {
              ""name"": ""Renesas""
            },
            ""specs"": [
              {
                ""attribute"": {
                  ""name"": ""Case/Package""
                },
                ""displayValue"": ""LFQFP""
              },
              {
                ""attribute"": {
                  ""name"": ""Core Architecture""
                },
                ""displayValue"": ""G3KH""
              },
              {
                ""attribute"": {
                  ""name"": ""Data Bus Width""
                },
                ""displayValue"": ""32 b""
              },
              {
                ""attribute"": {
                  ""name"": ""Frequency""
                },
                ""displayValue"": ""120 MHz""
              },
              {
                ""attribute"": {
                  ""name"": ""Interface""
                },
                ""displayValue"": ""CAN, I2C, LIN""
              },
              {
                ""attribute"": {
                  ""name"": ""Max Supply Voltage""
                },
                ""displayValue"": ""5.5 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Memory Type""
                },
                ""displayValue"": ""FLASH""
              },
              {
                ""attribute"": {
                  ""name"": ""Min Supply Voltage""
                },
                ""displayValue"": ""3 V""
              },
              {
                ""attribute"": {
                  ""name"": ""Number of Pins""
                },
                ""displayValue"": ""100""
              },
              {
                ""attribute"": {
                  ""name"": ""RAM Size""
                },
                ""displayValue"": ""128 kB""
              }
            ]
          }
        }
      ]
    }
  }';
var htmlTable = jsonToHtmlTable(jsonData);
console.log(htmlTable);
