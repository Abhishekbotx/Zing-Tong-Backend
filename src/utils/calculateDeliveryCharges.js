const calculateDeliveryCharges=(orderValue, distance, deliveryTime)=> {
    const baseCharge = 30; 
    const perKmCharge = 10; 
    const peakHourSurcharge = 20; 
    const lateNightSurcharge = 30; 


    let distanceCharge = distance * perKmCharge;

    let orderValueAdjustment = 0;
    if (orderValue > 500) {
        orderValueAdjustment = -20; 
    } else if (orderValue < 100) {
        orderValueAdjustment = 10; 
    }


    let timeAdjustment = 0;
    const hour = new Date(deliveryTime).getHours();
    if (hour >= 18 && hour <= 21) {
        timeAdjustment = peakHourSurcharge; 
    } else if (hour >= 22 || hour <= 6) {
        timeAdjustment = lateNightSurcharge;
    }


    const totalDeliveryPrice = baseCharge + distanceCharge + orderValueAdjustment + timeAdjustment;

    return totalDeliveryPrice;
}


const orderValue = 450;
const distance = 13; 
const deliveryTime = "2024-07-02T19:30:00"; 

const deliveryPrice = calculateDeliveryCharges(orderValue, distance, deliveryTime);

console.log(`The delivery price is ₹${deliveryPrice}`);
module.exports={calculateDeliveryCharges}