module.exports = {

    arraySearchBySubscriptionId: function(arr, val) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i].uuid === val)
                return arr[i];
        return false;
    },

    arraySearchByCustomerId: function(arr, val) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i].companyuuid === val)
                return arr[i];
        return false;
    },

    arraySearchByMasterId: function(arr, val) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i].uuid === val)
                return arr[i];
        return false;
    },

    makePayLoadForUserList: function(arr) {
        let payloadArr = [];
        for (var i = 0; i < arr.length; i++) {
            let obj = {};
            obj.customeruuid = arr[i].customer_uuid;
            obj.users = [];
            obj.users.push(arr[i].technical_contact_uuid);
            payloadArr.push(obj);
        }
        return payloadArr;
    },

    arraySearchByTechId: function(arr, customerUUID, technicalUUID) {
        let techName = false;
        if (arr.length) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].customeruuid === customerUUID) {
                    if (arr[i].users.length) {
                        let usersArr = arr[i].users;
                        for (var i = 0; i < usersArr.length; i++) {
                            if (usersArr[i].useruuid === technicalUUID) {
                                techName = usersArr[i];
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
        return techName;
    },
}