import { Component } from '@angular/core';
import { definePreset } from '@primeng/themes';
import Nora from '@primeng/themes/aura';
import { Accordion, AccordionPanel } from 'primeng/accordion';
export const neutral = definePreset(
    Nora,
    {semantic: {
            primary: {
                50: '{zinc.50}',
                100: '{zinc.100}',
                200: '{zinc.200}',
                300: '{zinc.300}',
                400: '{zinc.400}',
                500: '{zinc.500}',
                600: '{zinc.800}',
                700: '{zinc.700}',
                800: '{zinc.800}',
                900: '{zinc.900}',
                950: '{zinc.950}'
            }
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'white',
                }
            }
        }
    })

export const sunrise = definePreset(
    Nora,
    {
        semantic: {
            color1: '#8B2595',
            color2: '#F87789',
            color3: '#46146D',
            color4: '#FFFFFF',
            primary: {
                50: '{fuchsia.50}',
                100: '{fuchsia.100}',
                200: '{fuchsia.200}',
                300: '{fuchsia.300}',
                400: '{fuchsia.400}',
                500: '{fuchsia.500}',
                600: '#af3f92',
                700: '{fuchsia.700}',
                800: '{fuchsia.800}',
                900: '{fuchsia.900}',
                950: '{fuchsia.950}'
            },
            secondary: {
                50: '{rose.50}',
                100: '{rose.100}',
                200: '{rose.200}',
                300: '{rose.300}',
                400: '{rose.400}',
                500: '{rose.500}',
                600: '{rose.600}',
                700: '{rose.700}',
                800: '{rose.800}',
                900: '{rose.900}',
                950: '{rose.950}'
            },
            accent: {
                50: '{purple.50}',
                100: '{purple.100}',
                200: '{purple.200}',
                300: '{purple.300}',
                400: '{purple.400}',
                500: '{purple.500}',
                600: '{purple.600}',
                700: '{purple.700}',
                800: '{purple.800}',
                900: '{purple.900}',
                950: '{purple.950}'
            },
            neutral: {
                50: '{zinc.50}',
                100: '{zinc.100}',
                200: '{zinc.200}',
                300: '{zinc.300}',
                400: '{zinc.400}',
                500: '{zinc.500}',
                600: '{zinc.600}',
                700: '{zinc.700}',
                800: '{zinc.800}',
                900: '{zinc.900}',
                950: '{zinc.950}'
            },
        },
        components: {
            selectbutton: {
                color: 'rgba(0,0,0,0) !important',
                background: 'rgba(0,0,0,0) !important',
        },
            stepper: {
                steppanel: {
                    background: 'transparent',
                    color: 'var(--p-neutral-50)',
                }
            },
            datatable: {
                overflow: 'hidden',
                header:{
                    cell:{
                        borderRadius: '16px !important',
                        background: 'rgba(255, 255, 255, 0.4) !important'
                    }
                },
                row: {
                background: 'rgba(255, 255, 255, 0.2)',
                color:  'var(--p-neutral-50)',

                }
            },

            floatlabel: {
                focusColor: 'var(--p-neutral-50)',
                activeColor: 'var(--p-neutral-50)',
                invalidColor: 'var(--p-red-500)'
            },
            inputtext: {
                borderColor: 'var(--p-primary-50)',
                hoverBorderColor: 'var(--p-primary-100)'
            },
            button: {
                root: {
                    primary: {
                        background: 'var(--p-primary-600) !important',
                        color: 'var(--p-primary-50) !important',
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-accent-100) !important',
                        border: 'var(--p-accent-200) !important'
                    }
                },
                text: {
                    secondary: {
                        color: 'var(--p-primary-100) !important',      // text color
                        hoverColor: 'var(--p-primary-600) !important',  // color on hover
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover

                    }
                },
                outlined: {
                    secondary: {
                        color: 'var(--p-primary-100) !important',      // text color
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover
                        borderColor: 'var(--p-primary-100) !important',  // border color
                    }
                }
            },
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'linear-gradient(#4b66db,#8351cc, #ae40bd, #d88962)'
                    
                }
            }
        }
    }
)

export const sunset = definePreset(
    Nora,
    {
        semantic: {
            color1: '#8E4398',
            color2: '#FA9648',
            color3: '#662C9D',
            color4: '#E9E3E6',
            primary: {
                50: '{amber.50}',
                100: '{amber.100}',
                200: '{amber.200}',
                300: '{amber.300}',
                400: '{amber.400}',
                500: '{amber.500}',
                600: 'rgb(190,107,99)',
                700: '{amber.700}',
                800: '{amber.800}',
                900: '{amber.900}',
                950: '{amber.950}'

            },
            secondary: {
                50: '{amber.50}',
                100: '{amber.100}',
                200: '{amber.200}',
                300: '{amber.300}',
                400: '{amber.400}',
                500: '{amber.500}',
                600: '{amber.600}',
                700: '{amber.700}',
                800: '{amber.800}',
                900: '{amber.900}',
                950: '{amber.950}'
            },
            accent: {
                50: '{fuchsia.50}',
                100: '{fuchsia.100}',
                200: '{fuchsia.200}',
                300: '{fuchsia.300}',
                400: '{fuchsia.400}',
                500: '{fuchsia.500}',
                600: '{fuchsia.600}',
                700: '{fuchsia.700}',
                800: '{fuchsia.800}',
                900: '{fuchsia.900}',
                950: '{fuchsia.950}'
            },
            neutral: {
                50: '{zinc.50}',
                100: '{zinc.100}',
                200: '{zinc.200}',
                300: '{zinc.300}',
                400: '{zinc.400}',
                500: '{zinc.500}',
                600: '{zinc.600}',
                700: '{zinc.700}',
                800: '{zinc.800}',
                900: '{zinc.900}',
                950: '{zinc.950}'
            },
        },
        components: {
            stepper: {
                steppanel: {
                    background: 'transparent',
                    color: 'var(--p-neutral-50)',
                }
            },
            floatlabel: {
                color: 'var(--p-neutral-500)',
                focusColor: 'var(--p-neutral-50)',
                activeColor: 'var(--p-neutral-50)',
                invalidColor: 'var(--p-red-400)'
            },
                        datatable: {
                overflow: 'hidden',
                header:{
                    cell:{
                        borderRadius: '16px !important',
                        background: 'rgba(255, 255, 255, 0.4) !important'
                    }
                },
                row: {
                background: 'rgba(255, 255, 255, 0.2)',
                color:  'var(--p-neutral-50)',

                }
            },
            inputtext: {
                borderColor: 'var(--p-primary-50)',
                hoverBorderColor: 'var(--p-primary-100)'
            },
            button: {
                root: {
                    primary: {
                        background: 'var(--p-primary-600) !important',
                        hoverBackground: 'var(--p-primary-600/80) !important',  // color on hover

                    }
                },
                text: {
                    secondary: {
                        color: 'var(--p-primary-100) !important',      // text color
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover

                    },
                    primary : {
                        color: 'var(--p-primary-300) !important'
                    }
                },
                outlined: {
                    secondary: {
                        color: 'var(--p-primary-100) !important',      // text color
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover
                        borderColor: 'var(--p-primary-100) !important',  // border color
                    },
                    primary : {
                        color: 'var(--p-primary-50) !important',
                        hoverColor: 'var(--p-primary-600) !important',
                        borderColor: 'var(--p-primary-50) !important',  // border color
                        hoverBackground: 'rgba(187,77,0,0.3) !important'
                    }
                }
            },
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'linear-gradient(var(--p-indigo-950), var(--p-purple-800), var(--p-orange-400))',

                }
            }
        }
    })


export const forest = definePreset(
    Nora,
    {
        semantic: {
            color1: '#476959',
            color2: '#3D89A1',
            color3: '#1E313F',
            color4: '#C3D898',
            primary: {
                50: '{teal.50}',
                100: '{teal.100}',
                200: '{teal.200}',
                300: '{teal.300}',
                400: '{teal.400}',
                500: '{teal.500}',
                600: '#2c7744',
                700: '{teal.700}',
                800: '{teal.800}',
                900: '{teal.900}',
                950: '{teal.950}'
            },
            secondary: {
                50: '{amber.50}',
                100: '{amber.100}',
                200: '{amber.200}',
                300: '{amber.300}',
                400: '{amber.400}',
                500: '{amber.500}',
                600: '{amber.600}',
                700: '{amber.700}',
                800: '{amber.800}',
                900: '{amber.900}',
                950: '{amber.950}'
            },
            accent: {
                50: '{emerald.50}',
                100: '{emerald.100}',
                200: '{emerald.200}',
                300: '{emerald.300}',
                400: '{emerald.400}',
                500: '{emerald.500}',
                600: '{emerald.600}',
                700: '{emerald.700}',
                800: '{emerald.800}',
                900: '{emerald.900}',
                950: '{emerald.950}'
            },
            neutral: {
                50: '{zinc.50}',
                100: '{zinc.100}',
                200: '{zinc.200}',
                300: '{zinc.300}',
                400: '{zinc.400}',
                500: '{zinc.500}',
                600: '{zinc.600}',
                700: '{zinc.700}',
                800: '{zinc.800}',
                900: '{zinc.900}',
                950: '{zinc.950}'
            },
        },
        components: {
            stepper: {
                steppanel: {
                    background: 'transparent',
                    color: 'var(--p-neutral-50)',
                }
            },
            floatlabel: {
                focusColor: 'var(--p-neutral-50)',
                activeColor: 'var(--p-neutral-50)',
                invalidColor: 'var(--p-red-600)'
            },
            inputtext: {
                borderColor: 'var(--p-primary-50)',
                hoverBorderColor: 'var(--p-primary-100)'
            },
                        datatable: {
                overflow: 'hidden',
                header:{
                    cell:{
                        borderRadius: '16px !important',
                        background: 'rgba(255, 255, 255, 0.4) !important'
                    }
                },
                row: {
                background: 'rgba(255, 255, 255, 0.2)',
                color:  'var(--p-neutral-50)',

                }
            },
            button: {
                root: {
                    primary: {
                        background: 'var(--p-primary-700) !important',
                        hoverBackground: 'var(--p-primary-800) !important',  // color on hover

                    }
                },
                text: {
                    secondary: {
                        color: 'var(--p-primary-100) !important',      // text color
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover

                    }
                },
                outlined: {
                    secondary: {
                        color: 'var(--p-primary-100) !important',      // text color
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover
                        borderColor: 'var(--p-primary-100) !important',  // border color
                    }
                }
            },
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'url("/assets/bg-images/forest.webp")'
                }
            }
        }
    }
)



export const aurora = definePreset(
    Nora,
    {
        semantic: {
            color1: '#439FAB',
            color2: '#BF659E',
            color3: '#2C3D57',
            color4: '#C1B8C8',
            primary: {
                50: '{cyan.50}',
                100: '{cyan.100}',
                200: '{cyan.200}',
                300: '{cyan.300}',
                400: '{cyan.400}',
                500: '{cyan.500}',
                600: '{cyan.600}',
                700: '{cyan.700}',
                800: '{cyan.800}',
                900: '{cyan.900}',
                950: '{cyan.950}'
            },
            secondary: {
                50: '{amber.50}',
                100: '{amber.100}',
                200: '{amber.200}',
                300: '{amber.300}',
                400: '{amber.400}',
                500: '{amber.500}',
                600: '{amber.600}',
                700: '{amber.700}',
                800: '{amber.800}',
                900: '{amber.900}',
                950: '{amber.950}'
            },
            accent: {
                50: '{sky.50}',
                100: '{sky.100}',
                200: '{sky.200}',
                300: '{sky.300}',
                400: '{sky.400}',
                500: '{sky.500}',
                600: '{sky.600}',
                700: '{sky.700}',
                800: '{sky.800}',
                900: '{sky.900}',
                950: '{sky.950}'
            },
            neutral: {
                50: '{zinc.50}',
                100: '{zinc.100}',
                200: '{zinc.200}',
                300: '{zinc.300}',
                400: '{zinc.400}',
                500: '{zinc.500}',
                600: '{zinc.600}',
                700: '{zinc.700}',
                800: '{zinc.800}',
                900: '{zinc.900}',
                950: '{zinc.950}'
            },
        },
        components: {
            stepper: {
                steppanel: {
                    background: 'transparent',
                    color: 'var(--p-neutral-50)',
                }
            },
            floatlabel: {
                focusColor: 'var(--p-neutral-50)',
                activeColor: 'var(--p-neutral-50)',
                invalidColor: 'var(--p-red-500)'
            },
                        datatable: {
                overflow: 'hidden',
                header:{
                    cell:{
                        borderRadius: '16px !important',
                        background: 'rgba(255, 255, 255, 0.4) !important'
                    }
                },
                row: {
                background: 'rgba(255, 255, 255, 0.2)',
                color:  'var(--p-neutral-50)',

                }
            },
            inputtext: {
                borderColor: 'var(--p-primary-50)',
                hoverBorderColor: 'var(--p-primary-100)'
            },
            button: {
                root: {
                    primary: {
                        background: 'var(--p-primary-600) !important',
                    }
                },
                text: {
                    secondary: {
                        color: 'var(--p-primary-100) !important',      // text color
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover

                    }
                },
                outlined: {
                    secondary: {
                        color: 'var(--p-primary-100) !important',      // text color
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover
                        borderColor: 'var(--p-primary-100) !important',  // border color
                    },
                    primary : {
                        color: 'var(--p-primary-50) !important',
                        hoverColor: 'var(--p-primary-600) !important',
                        borderColor: 'var(--p-primary-50) !important',  // border color
                        hoverBackground: 'var(--p-primary-600) !important'
                    }
                }
            },
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'url("/assets/bg-images/aurora.webp")'
                }
            }
        }
    }
)


export const mountain = definePreset(
    Nora,
    {
        semantic: {
            primary: {
                50: '{stone.50}',
                100: '{stone.100}',
                200: '{stone.200}',
                300: '{stone.300}',
                400: '{stone.400}',
                500: '{stone.500}',
                600: '#98754e',
                700: '{stone.700}',
                800: '{stone.800}',
                900: '{stone.900}',
                950: '{stone.950}'
            },
            secondary: {
                50: '{slate.50}',
                100: '{slate.100}',
                200: '{slate.200}',
                300: '{slate.300}',
                400: '{slate.400}',
                500: '{slate.500}',
                600: '{slate.600}',
                700: '{slate.700}',
                800: '{slate.800}',
                900: '{slate.900}',
                950: '{slate.950}'
            },
            accent: {
                50: '{stone.50}',
                100: '{stone.100}',
                200: '{stone.200}',
                300: '{stone.300}',
                400: '{stone.400}',
                500: '{stone.500}',
                600: '{stone.600}',
                700: '{stone.700}',
                800: '{stone.800}',
                900: '{stone.700}',
                950: '{amber.950}'
            },
            neutral: {
                50: '{zinc.50}',
                100: '{zinc.100}',
                200: '{zinc.200}',
                300: '{zinc.300}',
                400: '{zinc.400}',
                500: '{zinc.500}',
                600: '{zinc.600}',
                700: '{zinc.700}',
                800: '{zinc.800}',
                900: '{zinc.900}',
                950: '{zinc.950}'
            },
        },
        components: {
            card:{
                background: 'transparent'
            },
            stepper: {
                steppanel: {
                    background: 'transparent',
                    color: 'var(--p-neutral-50)',
                }
            },
            floatlabel: {
                focusColor: 'var(--p-neutral-50)',
                activeColor: 'var(--p-neutral-50)',
                invalidColor: 'var(--p-red-500)'
            },
                        datatable: {
                overflow: 'hidden',
                header:{
                    cell:{
                        borderRadius: '16px !important',
                        background: 'rgba(255, 255, 255, 0.4) !important'
                    }
                },
                row: {
                background: 'rgba(255, 255, 255, 0.2)',
                color:  'var(--p-neutral-50)',

                }
            },
            inputtext: {
                borderColor: 'var(--p-primary-50)',
                hoverBorderColor: 'var(--p-primary-100)'
            },
            button: {
                root: {
                    primary: {
                        background: 'var(--p-accent-300) !important',
                        color: 'var(--p-primary-900) !important',
                        hoverColor: 'var(--p-primary-900) !important',  // color on hover
                        hoverBackground: 'var(--p-accent-400) !important',
                        border: 'var(--p-primary-200)'
                    }
                },
                text: {
                    secondary: {
                        color: 'var(--p-primary-100) !important',      // text color
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover

                    },
                    primary:{
                        color: 'var(--p-primary-300) !important',      // text color
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover

                    }
                },
                outlined: {
                    secondary: {
                        color: 'var(--p-primary-100) !important',      // text color
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover
                        borderColor: 'var(--p-primary-100) !important',  // border color
                    },
                    primary : {
                        color: 'var(--p-primary-50) !important',
                        hoverColor: 'var(--p-primary-600) !important',
                        borderColor: 'var(--p-primary-50) !important',  // border color
                        hoverBackground: 'var(--p-primary-600) !important'
                    }
                }
            },
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'url("/assets/bg-images/mountain.webp")'
                }
            }
        }
    }
)



export const morning = definePreset(
    Nora,
    {
        semantic: {
            accent: {
                50: '{cyan.50}',
                100: '{cyan.100}',
                200: '{cyan.200}',
                300: '{cyan.300}',
                400: '{cyan.400}',
                500: '{cyan.500}',
                600: '#1447e6',
                700: '{cyan.700}',
                800: '{cyan.800}',
                900: '{cyan.900}',
                950: '{cyan.950}'
            },
            secondary: {
                50: '{amber.50}',
                100: '{amber.100}',
                200: '{amber.200}',
                300: '{amber.300}',
                400: '{amber.400}',
                500: '{amber.500}',
                600: '{amber.600}',
                700: '{amber.700}',
                800: '{amber.800}',
                900: '{amber.900}',
                950: '{amber.950}'
            },
            primary: {
                50: '{sky.50}',
                100: '{sky.100}',
                200: '{sky.200}',
                300: '{sky.300}',
                400: '{sky.400}',
                500: '{sky.500}',
                600: '{sky.600}',
                700: '{sky.700}',
                800: '{sky.800}',
                900: '{sky.900}',
                950: '{sky.950}'
            },
            neutral: {
                50: '{zinc.50}',
                100: '{zinc.100}',
                200: '{zinc.200}',
                300: '{zinc.300}',
                400: '{zinc.400}',
                500: '{zinc.500}',
                600: '{zinc.600}',
                700: '{zinc.700}',
                800: '{zinc.800}',
                900: '{zinc.900}',
                950: '{zinc.950}'
            },
        },
        components: {
            stepper: {
                steppanel: {
                    background: 'transparent',
                    color: 'var(--p-primary-50)',
                }
            },
            floatlabel: {
                focusColor: 'var(--p-neutral-50)',
                activeColor: 'var(--p-neutral-50)',
                invalidColor: 'var(--p-red-600)'
            },
                        datatable: {
                overflow: 'hidden',
                header:{
                    cell:{
                        borderRadius: '16px !important',
                        background: 'rgba(255, 255, 255, 0.4) !important'
                    }
                },
                row: {
                background: 'rgba(255, 255, 255, 0.2)',
                color:  'var(--p-neutral-50)',

                }
            },
            inputtext: {
                borderColor: 'var(--p-primary-50)',
                hoverBorderColor: 'var(--p-primary-100)'
            },
            button: {
                root: {
                    primary: {
                        background: 'var(--p-primary-600) !important',
                    }
                },
                text: {
                    secondary: {
                        color: 'var(--p-primary-100) !important',      // text color
                        hoverColor: 'var(--p-primary-100) !important',  // color on hover
                        hoverBackground: 'var(--p-accent-100) !important',  // color on hover

                    },
                    primary: {
                        color: 'var(--p-primary-100) !important',
                        hoverBackground: 'var(--p-accent-100) !important',  // color on hover

                    }
                },
                outlined: {
                    secondary: {
                        color: 'var(--p-primary-100) !important',      // text color
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover
                        borderColor: 'var(--p-primary-100) !important',  // border color
                    },
                    primary : {
                        color: 'var(--p-primary-50) !important',
                        hoverColor: 'var(--p-primary-600) !important',
                        borderColor: 'var(--p-primary-50) !important',  // border color
                        hoverBackground: 'var(--p-primary-600) !important'
                    }
                }
            },
            selectButton: {
                borderColor: 'white'
            }
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'linear-gradient(#00b4db, #0083b0)',
                }
            }
        }
    }
)