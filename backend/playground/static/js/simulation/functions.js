function dist(point, center) {
    return Math.sqrt(Math.pow(center.x - point.x, 2) + Math.pow(center.y - point.y, 2))
}

function overlap(vertices1, vertices2) {

    let poly1 = vertices1
    let poly2 = vertices2

    for (let shape = 0; shape < 2; shape++) {
        if (shape == 1) {
            poly1 = vertices2
            poly2 = vertices1
        }

        for (let i = 0; i < poly1.length; i++) {
            let p1 = poly1[i]
            let p2 = poly1[(i + 1) % poly1.length]

            //Get vecteur projection
            let projVec = new Vector(-(p2.y - p1.y), p2.x - p1.x)

            let min1 = Infinity
            let max1 = -Infinity
            for (let i2 = 0; i2 < poly1.length; i2++) {
                //Get distance entre point et vecteur projection
                let q = poly1[i2].x * projVec.x + poly1[i2].y * projVec.y
                min1 = Math.min(min1, q)
                max1 = Math.max(max1, q)
            }

            let min2 = Infinity
            let max2 = -Infinity
            for (let i2 = 0; i2 < poly2.length; i2++) {
                //Get distance entre point et vecteur projection
                let q = poly2[i2].x * projVec.x + poly2[i2].y * projVec.y
                min2 = Math.min(min2, q)
                max2 = Math.max(max2, q)
            }

            if (!(max2 >= min1 && max1 >= min2)) return false
        }
    }
    return true
}