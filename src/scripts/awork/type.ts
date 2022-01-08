export interface AWorkResult {
    httpStatus: number
    content: {
        items: {
            all_results: {
                person: {
                    results: AWorkPerson[]
                },
                link: {
                    results: AWorkLink[]
                }
            }
        }
    },
    errors:[
        {
            code:string,
            field:string,
            msg:string
        }
    ],
    hasError:boolean
}

export interface AWorkPerson {
    emplId: string
    deptDesc: string
    buName: string
    lastName: string
    email: string
    work_addr_desc: string
    jobName: string
    chineseNickname: string
    image: string
    dingtalkId: string
}

export interface AWorkLink {
    id: number
    url: string
    icon: string,
    body:string,
    description:string
}