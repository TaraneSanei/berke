import { Component } from '@angular/core';
import { definePreset } from '@primeng/themes';
import Nora from '@primeng/themes/aura';


export const sunrise = definePreset(
    Nora,
    {
        semantic: {
            primary: {
                50: '{indigo.50}',
                100: '{indigo.100}',
                200: '{indigo.200}',
                300: '{indigo.300}',
                400: '{indigo.400}',
                500: '{indigo.500}',
                600: '{indigo.600}',
                700: '{indigo.700}',
                800: '{indigo.800}',
                900: '{indigo.900}',
                950: '{indigo.950}'
            },
            secondary: {
                50: '{pink.50}',
                100: '{pink.100}',
                200: '{pink.200}',
                300: '{pink.300}',
                400: '{pink.400}',
                500: '{pink.500}',
                600: '{pink.600}',
                700: '{pink.700}',
                800: '{pink.800}',
                900: '{pink.900}',
                950: '{pink.950}'
            },
            accent: '#FF5A28',
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
                color: 'var(--p-primary-600)',
                focusColor: 'var(--p-neutral-50)',
                activeColor: 'var(--p-neutral-50)',
                invalidColor: 'var(--p-red-600)'
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
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover
                        borderColor: 'var(--p-primary-100) !important',  // border color
                    }
                }
            },
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'linear-gradient(var(--p-primary-950), var(--p-primary-900), var(--p-secondary-700))',
                },
                '.p-button.p-button-text.p-button-secondary:hover' : {
                    color: 'var(--p-secondary-700) !important'
                }
            }
        }
    }
)

export const sunset = definePreset(
    Nora,
    {
        semantic: {
            primary: {
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
            accent: '#FF5A28',
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
                color: 'var(--p-primary-600)',
                focusColor: 'var(--p-neutral-50)',
                activeColor: 'var(--p-neutral-50)',
                invalidColor: 'var(--p-red-600)'
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
                    }
                }
            },
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'linear-gradient(var(--p-purple-950), var(--p-purple-800), var(--p-orange-300))',
                    '--app-text-shadow': '2px 2px 6px var(--p-neutral-950)',

                }
            }
        }
    })


export const forest = definePreset(
    Nora,
    {
        semantic: {
            primary: {
                50: '{teal.50}',
                100: '{teal.100}',
                200: '{teal.200}',
                300: '{teal.300}',
                400: '{teal.400}',
                500: '{teal.500}',
                600: '{teal.600}',
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
            accent: '#FF5A28',
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
                color: 'var(--p-primary-600)',
                focusColor: 'var(--p-neutral-50)',
                activeColor: 'var(--p-neutral-50)',
                invalidColor: 'var(--p-red-600)'
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
                    }
                }
            },
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'url("/assets/bg-images/forest.jpg")'
                }
            }
        }
    }
)



export const aurora = definePreset(
    Nora,
    {
        semantic: {
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
            accent: '#FF5A28',
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
                color: 'var(--p-primary-600)',
                focusColor: 'var(--p-neutral-50)',
                activeColor: 'var(--p-neutral-50)',
                invalidColor: 'var(--p-red-600)'
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
                    }
                }
            },
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'url("/assets/bg-images/aurora (5).jpg")'
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
            accent: '#FF5A28',
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
            accordion:{
                header:{
                    background: 'transparent',
                    hoverBackground: 'transparent'
                },
                content: {
                    background: 'transparent',
                    hoverBackground: 'transparent'
                }
            },
            stepper: {
                steppanel: {
                    background: 'transparent',
                    color: 'var(--p-neutral-50)',
                }
            },
            floatlabel: {
                color: 'var(--p-primary-600)',
                focusColor: 'var(--p-neutral-50)',
                activeColor: 'var(--p-neutral-50)',
                invalidColor: 'var(--p-red-600)'
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
                    }
                }
            },
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'url("/assets/bg-images/mountain (8).JPG")'
                }
            }
        }
    }
)



export const morning = definePreset(
    Nora,
    {
        semantic: {
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
            accent: '#FF5A28',
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
                    color: 'var(--p-primary-900)',
                }
            },
            floatlabel: {
                color: 'var(--p-primary-600)',
                focusColor: 'var(--p-neutral-50)',
                activeColor: 'var(--p-neutral-50)',
                invalidColor: 'var(--p-red-600)'
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
                        color: 'var(--p-primary-700) !important',      // text color
                        hoverBackground: 'var(--p-primary-50) !important',  // color on hover
                        borderColor: 'var(--p-primary-700) !important',  // border color
                    }
                }
            },
        },
        extend: {
            css: {
                ':root': {
                    '--app-background': 'linear-gradient(var(--p-sky-600), var(--p-blue-300), var(--p-blue-50))',
                }
            }
        }
    }
)