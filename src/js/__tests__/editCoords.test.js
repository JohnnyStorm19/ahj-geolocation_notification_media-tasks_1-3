import editCoords from "../components/editCoords";

test.each([
    { coords: '22.01, 76.11', expected: { latitude: '22.01', longitude: '76.11' } },
    { coords: '-56.014123, -176.112131', expected: { latitude: '-56.014123', longitude: '-176.112131' } },
    { coords: '92, 76.11', expected: { errors: 
        [
            { error: 'Неверно введена широта. Широта не должна превышать 90 градусов и быть не меньше -90 градусов' },
        ]
    }  
    },
    { coords: '86.12, 182.11', expected: { errors: 
        [
            { error: 'Неверно введена долгота. Долгота не должна превышать 180 градусов и быть не меньше -180 градусов' },
        ]
    }  
    },
    { coords: '86.12, -182.11', expected: { errors: 
        [
            { error: 'Неверно введена долгота. Долгота не должна превышать 180 градусов и быть не меньше -180 градусов' },
        ]
    }  
    },
    { coords: '-96.12, -172.11', expected: { errors: 
        [
            { error: 'Неверно введена широта. Широта не должна превышать 90 градусов и быть не меньше -90 градусов' },
        ]
    }  
    },
    { coords: '-92.01, -181.11', expected: { errors: 
        [
            { error: 'Неверно введена широта. Широта не должна превышать 90 градусов и быть не меньше -90 градусов' },
            { error: 'Неверно введена долгота. Долгота не должна превышать 180 градусов и быть не меньше -180 градусов' }
        ]
    } 
    },
    { coords: '92.01, 181.11', expected: { errors: 
            [
                { error: 'Неверно введена широта. Широта не должна превышать 90 градусов и быть не меньше -90 градусов' },
                { error: 'Неверно введена долгота. Долгота не должна превышать 180 градусов и быть не меньше -180 градусов' }
            ]
        } 
    }
])('Проверяем координаты: $coords', ( {coords, expected} ) => {
    let res = editCoords(coords);
    expect(res).toEqual(expected);
})