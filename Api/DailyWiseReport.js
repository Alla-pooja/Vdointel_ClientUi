import { getURL, jsonToParam ,jsonToFormData} from 'src/utils/config';
import { handleResponse } from 'src/utils/responseHandler';
import axios from 'src/axios';


const getDailyWiseReports = (body ,callback) => {
    const {date,latency } = body; 
    axios({
        method: 'get',
        url: `${getURL('/agent-reports/daily-wise-events')}?date=${date}&latency=${latency}`,
        // url: `${getURL('/dashboard/audits-by-month')}?${jsonToParam(params)}`,
        //http://192.168.30.105:9002/agent-reports/daily-wise-events?date=2023-09-28&latency=3
        //http://192.168.30.71:9002/agent-reports/daily-wise-events?date=2023-09-28&latency=3
        validateStatus: (status) => handleResponse(status)
    }).then((response) => callback(response))
   // console.log("response",`${getURL('/agent-reports/daily-wise-events')}?date=${date}&latency=${latency}`)
}

export{getDailyWiseReports}
