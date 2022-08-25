import React, { useState } from 'react';

import { getLastMonthStatistics } from '../../utilities/user_data';

export default function Overview() {
    const [lastMonthStatistics, setLastMonthStatistics] = useState(null);

    if (lastMonthStatistics == null) {
        getLastMonthStatistics().then(result => {
            setLastMonthStatistics(result);
        });
    }

    return <h1>Overview</h1>;
}
