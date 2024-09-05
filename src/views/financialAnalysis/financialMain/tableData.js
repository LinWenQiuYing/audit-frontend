// export default {
//   //年份数据
//   columns: [
//     {
//       title: "指定科目",
//       dataIndex: "project",
//       key: "project",
//       width: 150,
//     },
//     {
//       title: "2022",
//       // dataIndex: "year2022",
//       // key: "year2022",
//       width: 400,
//       children: [
//         {
//           title: "单位一",
//           // dataIndex: "site20220101",
//           // key: "site20220101",
//           children: [
//             {
//               title: "期初余额",
//               dataIndex: "startMoney2022单位一",
//               key: "startMoney2022单位一",
//               children: [
//                 {
//                   title: "借方",
//                   dataIndex: "startMoneyBrrow2022单位一",
//                   key: "moneyBrrow2022单位一",
//                 },
//                 {
//                   title: "贷方",
//                   dataIndex: "startMoneyGet2022单位一",
//                   key: "moneyGet2022单位一",
//                 },
//               ],
//             },
//             {
//               title: "累计发生额",
//               dataIndex: "allMoney2022单位一",
//               key: "allMoney2022单位一",
//               children: [
//                 {
//                   title: "借方",
//                   dataIndex: "allMoneyBrrow2022单位一",
//                   key: "allMoneyBrrow2022单位一",
//                 },
//                 {
//                   title: "贷方",
//                   dataIndex: "allMoneyGet2022单位一",
//                   key: "allMoneyGet2022单位一",
//                 },
//               ],
//             },
//             {
//               title: "期末余额",
//               dataIndex: "endMoney2022单位一",
//               key: "endMoney2022单位一",
//               children: [
//                 {
//                   title: "借方",
//                   dataIndex: "endMoneyBrrow2022单位一",
//                   key: "endMoneyBrrow2022单位一",
//                 },
//                 {
//                   title: "贷方",
//                   dataIndex: "endMoneyGet2022单位一",
//                   key: "endMoneyGet2022单位一",
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       title: "2022",
//       // dataIndex: "year2022",
//       // key: "year2022",
//       width: 400,
//       children: [
//         {
//           title: "单位二",
//           // dataIndex: "site20220101",
//           // key: "site20220101",
//           children: [
//             {
//               title: "期初余额",
//               dataIndex: "startMoney2022单位二",
//               key: "startMoney2022单位二",
//               children: [
//                 {
//                   title: "借方",
//                   dataIndex: "startMoneyBrrow2022单位二",
//                   key: "moneyBrrow2022单位二",
//                 },
//                 {
//                   title: "贷方",
//                   dataIndex: "startMoneyGet2022单位二",
//                   key: "moneyGet2022单位二",
//                 },
//               ],
//             },
//             {
//               title: "累计发生额",
//               dataIndex: "allMoney2022单位二",
//               key: "allMoney2022单位二",
//               children: [
//                 {
//                   title: "借方",
//                   dataIndex: "allMoneyBrrow2022单位二",
//                   key: "allMoneyBrrow2022单位二",
//                 },
//                 {
//                   title: "贷方",
//                   dataIndex: "allMoneyGet2022单位二",
//                   key: "allMoneyGet2022单位二",
//                 },
//               ],
//             },
//             {
//               title: "期末余额",
//               dataIndex: "endMoney2022单位二",
//               key: "endMoney2022单位二",
//               children: [
//                 {
//                   title: "借方",
//                   dataIndex: "endMoneyBrrow2022单位二",
//                   key: "endMoneyBrrow2022单位二",
//                 },
//                 {
//                   title: "贷方",
//                   dataIndex: "endMoneyGet2022单位二",
//                   key: "endMoneyGet2022单位二",
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   data: [
//     {
//       key: "科目1的code",
//       project: "科目1",
//       startMoneyBrrow2022单位一: "100.0000",
//       startMoneyGet2022单位一: "100.0000",
//       allMoneyBrrow2022单位一: "100.0000",
//       allMoneyGet2022单位一: "100.0000",
//       endMoneyBrrow2022单位一: "100.0000",
//       endMoneyGet2022单位一: "100.0000",

//       startMoneyBrrow2022单位二: "3.0000",
//       startMoneyGet2022单位二: "3.0000",
//       allMoneyBrrow2022单位二: "3.0000",
//       allMoneyGet2022单位二: "3.0000",
//       endMoneyBrrow2022单位二: "3.0000",
//       endMoneyGet2022单位二: "3.0000",

//       children: [
//         {
//           key: "科目11的code",
//           project: "科目11",
//           startMoneyBrrow2022单位一: "200.0000",
//           startMoneyGet2022单位一: "200.0000",
//           allMoneyBrrow2022单位一: "200.0000",
//           allMoneyGet2022单位一: "200.0000",
//           endMoneyBrrow2022单位一: "200.0000",
//           endMoneyGet2022单位一: "200.0000",

//           startMoneyBrrow2022单位二: "4.0000",
//           startMoneyGet2022单位二: "4.0000",
//           allMoneyBrrow2022单位二: "4.0000",
//           allMoneyGet2022单位二: "4.0000",
//           endMoneyBrrow2022单位二: "4.0000",
//           endMoneyGet2022单位二: "4.0000",

//           children: [
//             {
//               key: "科目111的code",
//               project: "科目111",
//               startMoneyBrrow2022单位一: "300.0000",
//               startMoneyGet2022单位一: "300.0000",
//               allMoneyBrrow2022单位一: "300.0000",
//               allMoneyGet2022单位一: "300.0000",
//               endMoneyBrrow2022单位一: "300.0000",
//               endMoneyGet2022单位一: "300.0000",

//               startMoneyBrrow2022单位二: "5.0000",
//               startMoneyGet2022单位二: "5.0000",
//               allMoneyBrrow2022单位二: "5.0000",
//               allMoneyGet2022单位二: "5.0000",
//               endMoneyBrrow2022单位二: "5.0000",
//               endMoneyGet2022单位二: "5.0000",
//             },
//             {
//               key: "科目112的code",
//               project: "科目112",
//               startMoneyBrrow2022单位一: "300.0000",
//               startMoneyGet2022单位一: "300.0000",
//               allMoneyBrrow2022单位一: "300.0000",
//               allMoneyGet2022单位一: "300.0000",
//               endMoneyBrrow2022单位一: "300.0000",
//               endMoneyGet2022单位一: "300.0000",

//               startMoneyBrrow2022单位二: "6.0000",
//               startMoneyGet2022单位二: "6.0000",
//               allMoneyBrrow2022单位二: "6.0000",
//               allMoneyGet2022单位二: "6.0000",
//               endMoneyBrrow2022单位二: "6.0000",
//               endMoneyGet2022单位二: "6.0000",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       key: "科目2的code",
//       project: "科目2",
//       startMoneyBrrow2022单位一: "200.0000",
//       startMoneyGet2022单位一: "200.0000",
//       allMoneyBrrow2022单位一: "200.0000",
//       allMoneyGet2022单位一: "200.0000",
//       endMoneyBrrow2022单位一: "200.0000",
//       endMoneyGet2022单位一: "200.0000",

//       startMoneyBrrow2022单位二: "100.0000",
//       startMoneyGet2022单位二: "100.0000",
//       allMoneyBrrow2022单位二: "100.0000",
//       allMoneyGet2022单位二: "100.0000",
//       endMoneyBrrow2022单位二: "100.0000",
//       endMoneyGet2022单位二: "100.0000",

//       children: [
//         {
//           key: "科目21的code",
//           project: "科目21",
//           startMoneyBrrow2022单位一: "200.0000",
//           startMoneyGet2022单位一: "200.0000",
//           allMoneyBrrow2022单位一: "200.0000",
//           allMoneyGet2022单位一: "200.0000",
//           endMoneyBrrow2022单位一: "200.0000",
//           endMoneyGet2022单位一: "200.0000",

//           startMoneyBrrow2022单位二: "200.0000",
//           startMoneyGet2022单位二: "200.0000",
//           allMoneyBrrow2022单位二: "200.0000",
//           allMoneyGet2022单位二: "200.0000",
//           endMoneyBrrow2022单位二: "200.0000",
//           endMoneyGet2022单位二: "200.0000",

//           children: [
//             {
//               key: "科目211的code",
//               project: "科目211",
//               startMoneyBrrow2022单位一: "200.0000",
//               startMoneyGet2022单位一: "200.0000",
//               allMoneyBrrow2022单位一: "200.0000",
//               allMoneyGet2022单位一: "200.0000",
//               endMoneyBrrow2022单位一: "200.0000",
//               endMoneyGet2022单位一: "200.0000",

//               startMoneyBrrow2022单位二: "300.0000",
//               startMoneyGet2022单位二: "300.0000",
//               allMoneyBrrow2022单位二: "300.0000",
//               allMoneyGet2022单位二: "300.0000",
//               endMoneyBrrow2022单位二: "300.0000",
//               endMoneyGet2022单位二: "300.0000",
//             },
//           ],
//         },
//       ],
//     },
//     {
//       project: "合计",
//       startMoneyBrrow2022单位一: "1000.0000",
//       startMoneyGet2022单位一: "2000.0000",
//       allMoneyBrrow2022单位一: "3000.0000",
//       allMoneyGet2022单位一: "4000.0000",
//       endMoneyBrrow2022单位一: "5000.0000",
//       endMoneyGet2022单位一: "6000.0000",

//       startMoneyBrrow2022单位二: "1000.0000",
//       startMoneyGet2022单位二: "2000.0000",
//       allMoneyBrrow2022单位二: "3000.0000",
//       allMoneyGet2022单位二: "4000.0000",
//       endMoneyBrrow2022单位二: "5000.0000",
//       endMoneyGet2022单位二: "6000.0000",
//     },
//   ],
//   //月份数据
//   // columns: [
//   //   {
//   //     title: "指定科目",
//   //     dataIndex: "project",
//   //     key: "project",
//   //     width: 150,
//   //   },
//   //   {
//   //     title: "2022",
//   //     // dataIndex: "year2022",
//   //     // key: "year2022",
//   //     width: 400,
//   //     children: [
//   //       {
//   //         title: "1月",
//   //         // dataIndex: "month1",
//   //         // key: "month1",
//   //         children: [
//   //           {
//   //             title: "单位一",
//   //             // dataIndex: "site20220101",
//   //             // key: "site20220101",
//   //             children: [
//   //               {
//   //                 title: "期初余额",
//   //                 dataIndex: "startMoney202201单位一",
//   //                 key: "startMoney202201单位一",
//   //                 children: [
//   //                   {
//   //                     title: "借方",
//   //                     dataIndex: "startMoneyBrrow202201单位一",
//   //                     key: "moneyBrrow202201单位一",
//   //                   },
//   //                   {
//   //                     title: "贷方",
//   //                     dataIndex: "startMoneyGet202201单位一",
//   //                     key: "moneyGet202201单位一",
//   //                   },
//   //                 ],
//   //               },
//   //               {
//   //                 title: "累计发生额",
//   //                 dataIndex: "allMoney2022010单位一",
//   //                 key: "allMoney202201单位一",
//   //                 children: [
//   //                   {
//   //                     title: "借方",
//   //                     dataIndex: "allMoneyBrrow202201单位一",
//   //                     key: "allMoneyBrrow202201单位一",
//   //                   },
//   //                   {
//   //                     title: "贷方",
//   //                     dataIndex: "allMoneyGet202201单位一",
//   //                     key: "allMoneyGet202201单位一",
//   //                   },
//   //                 ],
//   //               },
//   //               {
//   //                 title: "期末余额",
//   //                 dataIndex: "endMoney202201单位一",
//   //                 key: "endMoney202201单位一",
//   //                 children: [
//   //                   {
//   //                     title: "借方",
//   //                     dataIndex: "endMoneyBrrow202201单位一",
//   //                     key: "endMoneyBrrow202201单位一",
//   //                   },
//   //                   {
//   //                     title: "贷方",
//   //                     dataIndex: "endMoneyGet202201单位一",
//   //                     key: "endMoneyGet202201单位一",
//   //                   },
//   //                 ],
//   //               },
//   //             ],
//   //           },
//   //         ],
//   //       },
//   //     ],
//   //   },
//   //   {
//   //     title: "2022",
//   //     // dataIndex: "year2022",
//   //     // key: "year2022",
//   //     width: 400,
//   //     children: [
//   //       {
//   //         title: "2月",
//   //         // dataIndex: "month1",
//   //         // key: "month1",
//   //         children: [
//   //           {
//   //             title: "单位二",
//   //             // dataIndex: "site20220101",
//   //             // key: "site20220101",
//   //             children: [
//   //               {
//   //                 title: "期初余额",
//   //                 dataIndex: "startMoney202202单位二",
//   //                 key: "startMoney202202单位二",
//   //                 children: [
//   //                   {
//   //                     title: "借方",
//   //                     dataIndex: "startMoneyBrrow202202单位二",
//   //                     key: "moneyBrrow202202单位二",
//   //                   },
//   //                   {
//   //                     title: "贷方",
//   //                     dataIndex: "startMoneyGet202202单位二",
//   //                     key: "moneyGet202202单位二",
//   //                   },
//   //                 ],
//   //               },
//   //               {
//   //                 title: "累计发生额",
//   //                 dataIndex: "allMoney202202单位二",
//   //                 key: "allMoney202202单位二",
//   //                 children: [
//   //                   {
//   //                     title: "借方",
//   //                     dataIndex: "allMoneyBrrow202202单位二",
//   //                     key: "allMoneyBrrow202202单位二",
//   //                   },
//   //                   {
//   //                     title: "贷方",
//   //                     dataIndex: "allMoneyGet202202单位二",
//   //                     key: "allMoneyGet202202单位二",
//   //                   },
//   //                 ],
//   //               },
//   //               {
//   //                 title: "期末余额",
//   //                 dataIndex: "endMoney202202单位二",
//   //                 key: "endMoney202202单位二",
//   //                 children: [
//   //                   {
//   //                     title: "借方",
//   //                     dataIndex: "endMoneyBrrow202202单位二",
//   //                     key: "endMoneyBrrow202202单位二",
//   //                   },
//   //                   {
//   //                     title: "贷方",
//   //                     dataIndex: "endMoneyGet202202单位二",
//   //                     key: "endMoneyGet202202单位二",
//   //                   },
//   //                 ],
//   //               },
//   //             ],
//   //           },
//   //         ],
//   //       },
//   //     ],
//   //   },
//   // ],
//   // data: [
//   //   {
//   //     key: "科目1的code",
//   //     project: "科目1",
//   //     //2022年1月单位一科目一的数据
//   //     startMoneyBrrow202201单位一: 100,
//   //     startMoneyGet202201单位一: 100,
//   //     allMoneyBrrow202201单位一: 100,
//   //     allMoneyGet202201单位一: 100,
//   //     endMoneyBrrow202201单位一: 100,
//   //     endMoneyGet202201单位一: 100,

//   //     //2022年2月单位二科目1的数据
//   //     startMoneyBrrow202202单位二: 3,
//   //     startMoneyGet202202单位二: 3,
//   //     allMoneyBrrow202202单位二: 3,
//   //     allMoneyGet202202单位二: 3,
//   //     endMoneyBrrow202202单位二: 3,
//   //     endMoneyGet202202单位二: 3,

//   //     children: [
//   //       {
//   //         key: "科目11的code",
//   //         project: "科目11",
//   //         //2022年1月单位一科目11的数据
//   //         startMoneyBrrow202201单位一: 200,
//   //         startMoneyGet202201单位一: 200,
//   //         allMoneyBrrow202201单位一: 200,
//   //         allMoneyGet202201单位一: 200,
//   //         endMoneyBrrow202201单位一: 200,
//   //         endMoneyGet202201单位一: 200,

//   //         //2022年2月单位二科目11的数据
//   //         startMoneyBrrow202202单位二: 4,
//   //         startMoneyGet202202单位二: 4,
//   //         allMoneyBrrow202202单位二: 4,
//   //         allMoneyGet202202单位二: 4,
//   //         endMoneyBrrow202202单位二: 4,
//   //         endMoneyGet202202单位二: 4,
//   //         children: [
//   //           {
//   //             key: "科目111的code",
//   //             project: "科目111",
//   //             //2022年1月单位一科目111的数据
//   //             startMoneyBrrow202201单位一: 300,
//   //             startMoneyGet202201单位一: 300,
//   //             allMoneyBrrow202201单位一: 300,
//   //             allMoneyGet202201单位一: 300,
//   //             endMoneyBrrow202201单位一: 300,
//   //             endMoneyGet202201单位一: 300,

//   //             //2022年2月单位二科目111的数据
//   //             startMoneyBrrow202202单位二: 5,
//   //             startMoneyGet202202单位二: 5,
//   //             allMoneyBrrow202202单位二: 5,
//   //             allMoneyGet202202单位二: 5,
//   //             endMoneyBrrow202202单位二: 5,
//   //             endMoneyGet202202单位二: 5,
//   //           },
//   //           {
//   //             key: "科目112的code",
//   //             project: "科目112",
//   //             //2022年1月单位一科目1112的数据
//   //             startMoneyBrrow202201单位一: 300,
//   //             startMoneyGet202201单位一: 300,
//   //             allMoneyBrrow202201单位一: 300,
//   //             allMoneyGet202201单位一: 300,
//   //             endMoneyBrrow202201单位一: 300,
//   //             endMoneyGet202201单位一: 300,

//   //             //2022年2月单位二科目1112的数据
//   //             startMoneyBrrow202202单位二: 6,
//   //             startMoneyGet202202单位二: 6,
//   //             allMoneyBrrow202202单位二: 6,
//   //             allMoneyGet202202单位二: 6,
//   //             endMoneyBrrow202202单位二: 6,
//   //             endMoneyGet202202单位二: 6,
//   //           },
//   //         ],
//   //       },
//   //     ],
//   //   },
//   //   {
//   //     key: "科目2的code",
//   //     project: "科目2",
//   //     //2022年1月单位一科目2的数据
//   //     startMoneyBrrow202201单位一: 200,
//   //     startMoneyGet202201单位一: 200,
//   //     allMoneyBrrow202201单位一: 200,
//   //     allMoneyGet202201单位一: 200,
//   //     endMoneyBrrow202201单位一: 200,
//   //     endMoneyGet202201单位一: 200,
//   //     //2022年1月单位二科目2的数据
//   //     startMoneyBrrow202202单位二: 100,
//   //     startMoneyGet202202单位二: 100,
//   //     allMoneyBrrow202202单位二: 100,
//   //     allMoneyGet202202单位二: 100,
//   //     endMoneyBrrow202202单位二: 100,
//   //     endMoneyGet202202单位二: 100,
//   //     children: [
//   //       {
//   //         key: "科目21的code",
//   //         project: "科目21",
//   //         //2022年1月单位一科目11的数据
//   //         startMoneyBrrow202201单位一: 200,
//   //         startMoneyGet202201单位一: 200,
//   //         allMoneyBrrow202201单位一: 200,
//   //         allMoneyGet202201单位一: 200,
//   //         endMoneyBrrow202201单位一: 200,
//   //         endMoneyGet202201单位一: 200,
//   //         //2022年2月单位二科目11的数据
//   //         startMoneyBrrow202202单位二: 200,
//   //         startMoneyGet202202单位二: 200,
//   //         allMoneyBrrow202202单位二: 200,
//   //         allMoneyGet202202单位二: 200,
//   //         endMoneyBrrow202202单位二: 200,
//   //         endMoneyGet202202单位二: 200,
//   //         children: [
//   //           {
//   //             key: "科目211的code",
//   //             project: "科目211",
//   //             //2022年1月单位一科目11的数据
//   //             startMoneyBrrow202201单位一: 200,
//   //             startMoneyGet202201单位一: 200,
//   //             allMoneyBrrow202201单位一: 200,
//   //             allMoneyGet202201单位一: 200,
//   //             endMoneyBrrow202201单位一: 200,
//   //             endMoneyGet202201单位一: 200,
//   //             //2022年2月单位二科目11的数据
//   //             startMoneyBrrow202202单位二: 300,
//   //             startMoneyGet202202单位二: 300,
//   //             allMoneyBrrow202202单位二: 300,
//   //             allMoneyGet202202单位二: 300,
//   //             endMoneyBrrow202202单位二: 300,
//   //             endMoneyGet202202单位二: 300,
//   //           },
//   //         ],
//   //       },
//   //     ],
//   //   },

//   //   {
//   //     project: "合计",
//   //     //2022年1月单位一的合计数据
//   //     startMoneyBrrow202201单位一: 1000,
//   //     startMoneyGet202201单位一: 2000,
//   //     allMoneyBrrow202201单位一: 3000,
//   //     allMoneyGet202201单位一: 4000,
//   //     endMoneyBrrow202201单位一: 5000,
//   //     endMoneyGet202201单位一: 6000,

//   //     //2022年1月单位一的合计数据
//   //     startMoneyBrrow202202单位二: 1000,
//   //     startMoneyGet202202单位二: 2000,
//   //     allMoneyBrrow202202单位二: 3000,
//   //     allMoneyGet202202单位二: 4000,
//   //     endMoneyBrrow202202单位二: 5000,
//   //     endMoneyGet202202单位二: 6000,
//   //   },
//   // ],
// };
export default {
  columns: [
    {
      title: "科目名称",
      dataIndex: "project",
      key: "project",
      width: 250,
      fixed: "left",
    },
    {
      title: "期初余额",
      children: [
        {
          title: "上海市居民网管理中心",
          children: [
            {
              title: "2021",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2021上海市居民网管理中心",
                  key: "startMoneyBrrow2021上海市居民网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2021上海市居民网管理中心",
                  key: "startMoneyGet2021上海市居民网管理中心",
                  width: 200,
                },
              ],
            },
            {
              title: "2022",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2022上海市居民网管理中心",
                  key: "startMoneyBrrow2022上海市居民网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2022上海市居民网管理中心",
                  key: "startMoneyGet2022上海市居民网管理中心",
                  width: 200,
                },
              ],
            },
            {
              title: "2023",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2023上海市居民网管理中心",
                  key: "startMoneyBrrow2023上海市居民网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2023上海市居民网管理中心",
                  key: "startMoneyGet2023上海市居民网管理中心",
                  width: 200,
                },
              ],
            },
          ],
        },
        {
          title: "上海市公务网管理中心",
          children: [
            {
              title: "2021",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2021上海市公务网管理中心",
                  key: "startMoneyBrrow2021上海市公务网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2021上海市公务网管理中心",
                  key: "startMoneyGet2021上海市公务网管理中心",
                  width: 200,
                },
              ],
            },
            {
              title: "2022",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2022上海市公务网管理中心",
                  key: "startMoneyBrrow2022上海市公务网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2022上海市公务网管理中心",
                  key: "startMoneyGet2022上海市公务网管理中心",
                  width: 200,
                },
              ],
            },
            {
              title: "2023",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2023上海市公务网管理中心",
                  key: "startMoneyBrrow2023上海市公务网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2023上海市公务网管理中心",
                  key: "startMoneyGet2023上海市公务网管理中心",
                  width: 200,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "累计发生额",
      children: [
        {
          title: "上海市居民网管理中心",
          children: [
            {
              title: "2021",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2021上海市居民网管理中心",
                  key: "startMoneyBrrow2021上海市居民网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2021上海市居民网管理中心",
                  key: "startMoneyGet2021上海市居民网管理中心",
                  width: 200,
                },
              ],
            },
            {
              title: "2022",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2022上海市居民网管理中心",
                  key: "startMoneyBrrow2022上海市居民网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2022上海市居民网管理中心",
                  key: "startMoneyGet2022上海市居民网管理中心",
                  width: 200,
                },
              ],
            },
            {
              title: "2023",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2023上海市居民网管理中心",
                  key: "startMoneyBrrow2023上海市居民网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2023上海市居民网管理中心",
                  key: "startMoneyGet2023上海市居民网管理中心",
                  width: 200,
                },
              ],
            },
          ],
        },
        {
          title: "上海市公务网管理中心",
          children: [
            {
              title: "2021",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2021上海市公务网管理中心",
                  key: "startMoneyBrrow2021上海市公务网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2021上海市公务网管理中心",
                  key: "startMoneyGet2021上海市公务网管理中心",
                  width: 200,
                },
              ],
            },
            {
              title: "2022",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2022上海市公务网管理中心",
                  key: "startMoneyBrrow2022上海市公务网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2022上海市公务网管理中心",
                  key: "startMoneyGet2022上海市公务网管理中心",
                  width: 200,
                },
              ],
            },
            {
              title: "2023",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2023上海市公务网管理中心",
                  key: "startMoneyBrrow2023上海市公务网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2023上海市公务网管理中心",
                  key: "startMoneyGet2023上海市公务网管理中心",
                  width: 200,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "期末余额",
      children: [
        {
          title: "上海市居民网管理中心",
          children: [
            {
              title: "2021",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2021上海市居民网管理中心",
                  key: "startMoneyBrrow2021上海市居民网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2021上海市居民网管理中心",
                  key: "startMoneyGet2021上海市居民网管理中心",
                  width: 200,
                },
              ],
            },
            {
              title: "2022",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2022上海市居民网管理中心",
                  key: "startMoneyBrrow2022上海市居民网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2022上海市居民网管理中心",
                  key: "startMoneyGet2022上海市居民网管理中心",
                  width: 200,
                },
              ],
            },
            {
              title: "2023",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2023上海市居民网管理中心",
                  key: "startMoneyBrrow2023上海市居民网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2023上海市居民网管理中心",
                  key: "startMoneyGet2023上海市居民网管理中心",
                  width: 200,
                },
              ],
            },
          ],
        },
        {
          title: "上海市公务网管理中心",
          children: [
            {
              title: "2021",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2021上海市公务网管理中心",
                  key: "startMoneyBrrow2021上海市公务网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2021上海市公务网管理中心",
                  key: "startMoneyGet2021上海市公务网管理中心",
                  width: 200,
                },
              ],
            },
            {
              title: "2022",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2022上海市公务网管理中心",
                  key: "startMoneyBrrow2022上海市公务网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2022上海市公务网管理中心",
                  key: "startMoneyGet2022上海市公务网管理中心",
                  width: 200,
                },
              ],
            },
            {
              title: "2023",
              children: [
                {
                  title: "借方",
                  dataIndex: "startMoneyBrrow2023上海市公务网管理中心",
                  key: "startMoneyBrrow2023上海市公务网管理中心",
                  width: 200,
                },
                {
                  title: "贷方",
                  dataIndex: "startMoneyGet2023上海市公务网管理中心",
                  key: "startMoneyGet2023上海市公务网管理中心",
                  width: 200,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  data: [
    {
      key: "1001",
      parentKey: "",
      project: "1001--库存现金",
      startMoneyBrrow2021上海市居民网管理中心: "938.9888",
      startMoneyGet2021上海市居民网管理中心: "0.0000",
      allMoneyBrrow2021上海市居民网管理中心: "1700.4000",
      allMoneyGet2021上海市居民网管理中心: "1006.6313",
      endMoneyBrrow2021上海市居民网管理中心: "938.9888",
      endMoneyGet2021上海市居民网管理中心: "0.0000",
      startMoneyBrrow2022上海市居民网管理中心: "938.9888",
      startMoneyGet2022上海市居民网管理中心: "0.0000",
      allMoneyBrrow2022上海市居民网管理中心: "1700.4000",
      allMoneyGet2022上海市居民网管理中心: "1006.6313",
      endMoneyBrrow2022上海市居民网管理中心: "938.9888",
      endMoneyGet2022上海市居民网管理中心: "0.0000",
      startMoneyBrrow2023上海市居民网管理中心: "938.9888",
      startMoneyGet2023上海市居民网管理中心: "0.0000",
      allMoneyBrrow2023上海市居民网管理中心: "1700.4000",
      allMoneyGet2023上海市居民网管理中心: "1006.6313",
      endMoneyBrrow2023上海市居民网管理中心: "938.9888",
      endMoneyGet2023上海市居民网管理中心: "0.0000",
      startMoneyBrrow2021上海市公务网管理中心: "0.0000",
      startMoneyGet2021上海市公务网管理中心: "0.0000",
      allMoneyBrrow2021上海市公务网管理中心: "0.0000",
      allMoneyGet2021上海市公务网管理中心: "0.0000",
      endMoneyBrrow2021上海市公务网管理中心: "0.0000",
      endMoneyGet2021上海市公务网管理中心: "0.0000",
      startMoneyBrrow2022上海市公务网管理中心: "0.0000",
      startMoneyGet2022上海市公务网管理中心: "0.0000",
      allMoneyBrrow2022上海市公务网管理中心: "0.0000",
      allMoneyGet2022上海市公务网管理中心: "0.0000",
      endMoneyBrrow2022上海市公务网管理中心: "0.0000",
      endMoneyGet2022上海市公务网管理中心: "0.0000",
      startMoneyBrrow2023上海市公务网管理中心: "0.0000",
      startMoneyGet2023上海市公务网管理中心: "0.0000",
      allMoneyBrrow2023上海市公务网管理中心: "0.0000",
      allMoneyGet2023上海市公务网管理中心: "0.0000",
      endMoneyBrrow2023上海市公务网管理中心: "0.0000",
      endMoneyGet2023上海市公务网管理中心: "0.0000",
      children: [
        {
          key: "100101",
          parentKey: "1001",
          project: "100101--库存现金",
          startMoneyBrrow2021上海市居民网管理中心: "938.9888",
          startMoneyGet2021上海市居民网管理中心: "0.0000",
          allMoneyBrrow2021上海市居民网管理中心: "1700.4000",
          allMoneyGet2021上海市居民网管理中心: "1006.6313",
          endMoneyBrrow2021上海市居民网管理中心: "938.9888",
          endMoneyGet2021上海市居民网管理中心: "0.0000",
          startMoneyBrrow2022上海市居民网管理中心: "938.9888",
          startMoneyGet2022上海市居民网管理中心: "0.0000",
          allMoneyBrrow2022上海市居民网管理中心: "1700.4000",
          allMoneyGet2022上海市居民网管理中心: "1006.6313",
          endMoneyBrrow2022上海市居民网管理中心: "938.9888",
          endMoneyGet2022上海市居民网管理中心: "0.0000",
          startMoneyBrrow2023上海市居民网管理中心: "938.9888",
          startMoneyGet2023上海市居民网管理中心: "0.0000",
          allMoneyBrrow2023上海市居民网管理中心: "1700.4000",
          allMoneyGet2023上海市居民网管理中心: "1006.6313",
          endMoneyBrrow2023上海市居民网管理中心: "938.9888",
          endMoneyGet2023上海市居民网管理中心: "0.0000",
          startMoneyBrrow2021上海市公务网管理中心: "0.0000",
          startMoneyGet2021上海市公务网管理中心: "0.0000",
          allMoneyBrrow2021上海市公务网管理中心: "0.0000",
          allMoneyGet2021上海市公务网管理中心: "0.0000",
          endMoneyBrrow2021上海市公务网管理中心: "0.0000",
          endMoneyGet2021上海市公务网管理中心: "0.0000",
          startMoneyBrrow2022上海市公务网管理中心: "0.0000",
          startMoneyGet2022上海市公务网管理中心: "0.0000",
          allMoneyBrrow2022上海市公务网管理中心: "0.0000",
          allMoneyGet2022上海市公务网管理中心: "0.0000",
          endMoneyBrrow2022上海市公务网管理中心: "0.0000",
          endMoneyGet2022上海市公务网管理中心: "0.0000",
          startMoneyBrrow2023上海市公务网管理中心: "0.0000",
          startMoneyGet2023上海市公务网管理中心: "0.0000",
          allMoneyBrrow2023上海市公务网管理中心: "0.0000",
          allMoneyGet2023上海市公务网管理中心: "0.0000",
          endMoneyBrrow2023上海市公务网管理中心: "0.0000",
          endMoneyGet2023上海市公务网管理中心: "0.0000",
          children: [],
        },
        {
          key: "100102",
          parentKey: "1001",
          project: "100102--7465银行专户",
          startMoneyBrrow2021上海市居民网管理中心: "938.9888",
          startMoneyGet2021上海市居民网管理中心: "0.0000",
          allMoneyBrrow2021上海市居民网管理中心: "1700.4000",
          allMoneyGet2021上海市居民网管理中心: "1006.6313",
          endMoneyBrrow2021上海市居民网管理中心: "938.9888",
          endMoneyGet2021上海市居民网管理中心: "0.0000",
          startMoneyBrrow2022上海市居民网管理中心: "938.9888",
          startMoneyGet2022上海市居民网管理中心: "0.0000",
          allMoneyBrrow2022上海市居民网管理中心: "1700.4000",
          allMoneyGet2022上海市居民网管理中心: "1006.6313",
          endMoneyBrrow2022上海市居民网管理中心: "938.9888",
          endMoneyGet2022上海市居民网管理中心: "0.0000",
          startMoneyBrrow2023上海市居民网管理中心: "938.9888",
          startMoneyGet2023上海市居民网管理中心: "0.0000",
          allMoneyBrrow2023上海市居民网管理中心: "1700.4000",
          allMoneyGet2023上海市居民网管理中心: "1006.6313",
          endMoneyBrrow2023上海市居民网管理中心: "938.9888",
          endMoneyGet2023上海市居民网管理中心: "0.0000",
          startMoneyBrrow2021上海市公务网管理中心: "0.0000",
          startMoneyGet2021上海市公务网管理中心: "0.0000",
          allMoneyBrrow2021上海市公务网管理中心: "0.0000",
          allMoneyGet2021上海市公务网管理中心: "0.0000",
          endMoneyBrrow2021上海市公务网管理中心: "0.0000",
          endMoneyGet2021上海市公务网管理中心: "0.0000",
          startMoneyBrrow2022上海市公务网管理中心: "0.0000",
          startMoneyGet2022上海市公务网管理中心: "0.0000",
          allMoneyBrrow2022上海市公务网管理中心: "0.0000",
          allMoneyGet2022上海市公务网管理中心: "0.0000",
          endMoneyBrrow2022上海市公务网管理中心: "0.0000",
          endMoneyGet2022上海市公务网管理中心: "0.0000",
          startMoneyBrrow2023上海市公务网管理中心: "0.0000",
          startMoneyGet2023上海市公务网管理中心: "0.0000",
          allMoneyBrrow2023上海市公务网管理中心: "0.0000",
          allMoneyGet2023上海市公务网管理中心: "0.0000",
          endMoneyBrrow2023上海市公务网管理中心: "0.0000",
          endMoneyGet2023上海市公务网管理中心: "0.0000",
          children: [],
        },
        {
          key: "100110",
          parentKey: "1001",
          project: "100110--受托代理资产",
          startMoneyBrrow2021上海市居民网管理中心: "938.9888",
          startMoneyGet2021上海市居民网管理中心: "0.0000",
          allMoneyBrrow2021上海市居民网管理中心: "1700.4000",
          allMoneyGet2021上海市居民网管理中心: "1006.6313",
          endMoneyBrrow2021上海市居民网管理中心: "938.9888",
          endMoneyGet2021上海市居民网管理中心: "0.0000",
          startMoneyBrrow2022上海市居民网管理中心: "938.9888",
          startMoneyGet2022上海市居民网管理中心: "0.0000",
          allMoneyBrrow2022上海市居民网管理中心: "1700.4000",
          allMoneyGet2022上海市居民网管理中心: "1006.6313",
          endMoneyBrrow2022上海市居民网管理中心: "938.9888",
          endMoneyGet2022上海市居民网管理中心: "0.0000",
          startMoneyBrrow2023上海市居民网管理中心: "938.9888",
          startMoneyGet2023上海市居民网管理中心: "0.0000",
          allMoneyBrrow2023上海市居民网管理中心: "1700.4000",
          allMoneyGet2023上海市居民网管理中心: "1006.6313",
          endMoneyBrrow2023上海市居民网管理中心: "938.9888",
          endMoneyGet2023上海市居民网管理中心: "0.0000",
          startMoneyBrrow2021上海市公务网管理中心: "0.0000",
          startMoneyGet2021上海市公务网管理中心: "0.0000",
          allMoneyBrrow2021上海市公务网管理中心: "0.0000",
          allMoneyGet2021上海市公务网管理中心: "0.0000",
          endMoneyBrrow2021上海市公务网管理中心: "0.0000",
          endMoneyGet2021上海市公务网管理中心: "0.0000",
          startMoneyBrrow2022上海市公务网管理中心: "0.0000",
          startMoneyGet2022上海市公务网管理中心: "0.0000",
          allMoneyBrrow2022上海市公务网管理中心: "0.0000",
          allMoneyGet2022上海市公务网管理中心: "0.0000",
          endMoneyBrrow2022上海市公务网管理中心: "0.0000",
          endMoneyGet2022上海市公务网管理中心: "0.0000",
          startMoneyBrrow2023上海市公务网管理中心: "0.0000",
          startMoneyGet2023上海市公务网管理中心: "0.0000",
          allMoneyBrrow2023上海市公务网管理中心: "0.0000",
          allMoneyGet2023上海市公务网管理中心: "0.0000",
          endMoneyBrrow2023上海市公务网管理中心: "0.0000",
          endMoneyGet2023上海市公务网管理中心: "0.0000",
          children: [],
        },
      ],
    },
  ],
};
