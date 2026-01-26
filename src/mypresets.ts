import { Component } from '@angular/core';
import { definePreset } from '@primeng/themes';
import Nora from '@primeng/themes/aura';
import { Accordion, AccordionPanel } from 'primeng/accordion';


export const sunrise = definePreset(
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
                        background: 'var(--p-accent-200) !important',
                        color: 'var(--p-primary-600) !important',
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-accent-100) !important',
                        border: 'var(--p-accent-200) !important'
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
                    '--app-background': 'linear-gradient(var(--p-secondary-700), var(--p-primary-900), var(--p-primary-950))',
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
            inputtext: {
                borderColor: 'var(--p-primary-50)',
                hoverBorderColor: 'var(--p-primary-100)'
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
                    '--app-background': 'linear-gradient(var(--p-indigo-950), var(--p-purple-800), var(--p-orange-400))',

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
                50: '{stone.50}',
                100: '{stone.100}',
                200: '{stone.200}',
                300: '{stone.300}',
                400: '{stone.400}',
                500: '{stone.500}',
                600: '{stone.600}',
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
            inputtext: {
                borderColor: 'var(--p-primary-50)',
                hoverBorderColor: 'var(--p-primary-100)'
            },
            button: {
                root: {
                    primary: {
                        background: 'var(--p-accent-100) !important',
                        color: 'var(--p-primary-900) !important',
                        hoverColor: 'var(--p-primary-700) !important',  // color on hover
                        hoverBackground: 'var(--p-accent-50) !important',
                        border: 'var(--p-primary-200)'
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
                50: '{sky.900}',
                100: '{sky.900}',
                200: '{sky.800}',
                300: '{sky.700}',
                400: '{sky.600}',
                500: '{sky.500}',
                600: '{sky.400}',
                700: '{sky.300}',
                800: '{sky.200}',
                900: '{sky.100}',
                950: '{sky.50}'
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
                    '--app-background': 'linear-gradient(var(--p-cyan-500), var(--p-blue-300))',
                }
            }
        }
    }
)