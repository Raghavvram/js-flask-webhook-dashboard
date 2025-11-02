
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { useTheme } from "next-themes";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Globe, Smartphone, Building, FileText } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  ChartDataLabels
);

const countryCodeMapping: { [key: string]: string } = {
    'AD': 'Andorra', 'AE': 'United Arab Emirates', 'AF': 'Afghanistan', 'AG': 'Antigua and Barbuda',
    'AI': 'Anguilla', 'AL': 'Albania', 'AM': 'Armenia', 'AO': 'Angola', 'AQ': 'Antarctica',
    'AR': 'Argentina', 'AS': 'American Samoa', 'AT': 'Austria', 'AU': 'Australia',
    'AW': 'Aruba', 'AX': 'Åland Islands', 'AZ': 'Azerbaijan', 'BA': 'Bosnia and Herzegovina',
    'BB': 'Barbados', 'BD': 'Bangladesh', 'BE': 'Belgium', 'BF': 'Burkina Faso',
    'BG': 'Bulgaria', 'BH': 'Bahrain', 'BI': 'Burundi', 'BJ': 'Benin', 'BL': 'Saint Barthélemy',
    'BM': 'Bermuda', 'BN': 'Brunei', 'BO': 'Bolivia', 'BQ': 'Caribbean Netherlands',
    'BR': 'Brazil', 'BS': 'Bahamas', 'BT': 'Bhutan', 'BV': 'Bouvet Island',
    'BW': 'Botswana', 'BY': 'Belarus', 'BZ': 'Belize', 'CA': 'Canada',
    'CC': 'Cocos Islands', 'CD': 'Democratic Republic of the Congo', 'CF': 'Central African Republic',
    'CG': 'Congo', 'CH': 'Switzerland', 'CI': 'Ivory Coast', 'CK': 'Cook Islands',
    'CL': 'Chile', 'CM': 'Cameroon', 'CN': 'China', 'CO': 'Colombia', 'CR': 'Costa Rica',
    'CU': 'Cuba', 'CV': 'Cape Verde', 'CW': 'Curaçao', 'CX': 'Christmas Island',
    'CY': 'Cyprus', 'CZ': 'Czech Republic', 'DE': 'Germany', 'DJ': 'Djibouti',
    'DK': 'Denmark', 'DM': 'Dominica', 'DO': 'Dominican Republic', 'DZ': 'Algeria',
    'EC': 'Ecuador', 'EE': 'Estonia', 'EG': 'Egypt', 'EH': 'Western Sahara',
    'ER': 'Eritrea', 'ES': 'Spain', 'ET': 'Ethiopia', 'FI': 'Finland', 'FJ': 'Fiji',
    'FK': 'Falkland Islands', 'FM': 'Micronesia', 'FO': 'Faroe Islands', 'FR': 'France',
    'GA': 'Gabon', 'GB': 'United Kingdom', 'GD': 'Grenada', 'GE': 'Georgia',
    'GF': 'French Guiana', 'GG': 'Guernsey', 'GH': 'Ghana', 'GI': 'Gibraltar',
    'GL': 'Greenland', 'GM': 'Gambia', 'GN': 'Guinea', 'GP': 'Guadeloupe',
    'GQ': 'Equatorial Guinea', 'GR': 'Greece', 'GS': 'South Georgia', 'GT': 'Guatemala',
    'GU': 'Guam', 'GW': 'Guinea-Bissau', 'GY': 'Guyana', 'HK': 'Hong Kong',
    'HM': 'Heard Island', 'HN': 'Honduras', 'HR': 'Croatia', 'HT': 'Haiti',
    'HU': 'Hungary', 'ID': 'Indonesia', 'IE': 'Ireland', 'IL': 'Israel',
    'IM': 'Isle of Man', 'IN': 'India', 'IO': 'British Indian Ocean Territory', 'IQ': 'Iraq',
    'IR': 'Iran', 'IS': 'Iceland', 'IT': 'Italy', 'JE': 'Jersey', 'JM': 'Jamaica',
    'JO': 'Jordan', 'JP': 'Japan', 'KE': 'Kenya', 'KG': 'Kyrgyzstan', 'KH': 'Cambodia',
    'KI': 'Kiribati', 'KM': 'Comoros', 'KN': 'Saint Kitts and Nevis', 'KP': 'North Korea',
    'KR': 'South Korea', 'KW': 'Kuwait', 'KY': 'Cayman Islands', 'KZ': 'Kazakhstan',
    'LA': 'Laos', 'LB': 'Lebanon', 'LC': 'Saint Lucia', 'LI': 'Liechtenstein',
    'LK': 'Sri Lanka', 'LR': 'Liberia', 'LS': 'Lesotho', 'LT': 'Lithuania',
    'LU': 'Luxembourg', 'LV': 'Latvia', 'LY': 'Libya', 'MA': 'Morocco',
    'MC': 'Monaco', 'MD': 'Moldova', 'ME': 'Montenegro', 'MF': 'Saint Martin',
    'MG': 'Madagascar', 'MH': 'Marshall Islands', 'MK': 'Macedonia', 'ML': 'Mali',
    'MM': 'Myanmar', 'MN': 'Mongolia', 'MO': 'Macao', 'MP': 'Northern Mariana Islands',
    'MQ': 'Martinique', 'MR': 'Mauritania', 'MS': 'Montserrat', 'MT': 'Malta',
    'MU': 'Mauritius', 'MV': 'Maldives', 'MW': 'Malawi', 'MX': 'Mexico',
    'MY': 'Malaysia', 'MZ': 'Mozambique', 'NA': 'Namibia', 'NC': 'New Caledonia',
    'NE': 'Niger', 'NF': 'Norfolk Island', 'NG': 'Nigeria', 'NI': 'Nicaragua',
    'NL': 'Netherlands', 'NO': 'Norway', 'NP': 'Nepal', 'NR': 'Nauru',
    'NU': 'Niue', 'NZ': 'New Zealand', 'OM': 'Oman', 'PA': 'Panama',
    'PE': 'Peru', 'PF': 'French Polynesia', 'PG': 'Papua New Guinea', 'PH': 'Philippines',
    'PK': 'Pakistan', 'PL': 'Poland', 'PM': 'Saint Pierre and Miquelon', 'PN': 'Pitcairn',
    'PR': 'Puerto Rico', 'PS': 'Palestine', 'PT': 'Portugal', 'PW': 'Palau',
    'PY': 'Paraguay', 'QA': 'Qatar', 'RE': 'Reunion', 'RO': 'Romania',
    'RS': 'Serbia', 'RU': 'Russia', 'RW': 'Rwanda', 'SA': 'Saudi Arabia',
    'SB': 'Solomon Islands', 'SC': 'Seychelles', 'SD': 'Sudan', 'SE': 'Sweden',
    'SG': 'Singapore', 'SH': 'Saint Helena', 'SI': 'Slovenia', 'SJ': 'Svalbard and Jan Mayen',
    'SK': 'Slovakia', 'SL': 'Sierra Leone', 'SM': 'San Marino', 'SN': 'Senegal',
    'SO': 'Somalia', 'SR': 'Suriname', 'SS': 'South Sudan', 'ST': 'São Tomé and Príncipe',
    'SV': 'El Salvador', 'SX': 'Sint Maarten', 'SY': 'Syria', 'SZ': 'Swaziland',
    'TC': 'Turks and Caicos Islands', 'TD': 'Chad', 'TF': 'French Southern Territories',
    'TG': 'Togo', 'TH': 'Thailand', 'TJ': 'Tajikistan', 'TK': 'Tokau',
    'TL': 'East Timor', 'TM': 'Turkmenistan', 'TN': 'Tunisia', 'TO': 'Tonga',
    'TR': 'Turkey', 'TT': 'Trinidad and Tobago', 'TV': 'Tuvalu', 'TW': 'Taiwan',
    'TZ': 'Tanzania', 'UA': 'Ukraine', 'UG': 'Uganda', 'UM': 'United States Minor Outlying Islands',
    'US': 'United States', 'UY': 'Uruguay', 'UZ': 'Uzbekistan', 'VA': 'Vatican',
    'VC': 'Saint Vincent and the Grenadines', 'VE': 'Venezuela', 'VG': 'British Virgin Islands',
    'VI': 'U.S. Virgin Islands', 'VN': 'Vietnam', 'VU': 'Vanuatu', 'WF': 'Wallis and Futuna',
    'WS': 'Samoa', 'YE': 'Yemen', 'YT': 'Mayotte', 'ZA': 'South Africa',
    'ZM': 'Zambia', 'ZW': 'Zimbabwe'
};

export interface GlobalVisitorData {
    id: string;
    value: number;
    unique_visitors: number;
    returning_visitors: number;
}

export interface DeviceAnalyticsData {
    device_type: string;
    count: number;
}

export interface BrowserDistributionData {
    browser: string;
    count: number;
}

export interface AnalyticsChartsGridProps {
    chartsData: {
        by_device: DeviceAnalyticsData[];
        by_browser: BrowserDistributionData[];
    };
}

export function GlobalVisitorChart({ data }: { data: GlobalVisitorData[] }) {
  const { theme } = useTheme();
  const chartDiv = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any | null>(null);

  useEffect(() => {
    if (!chartDiv.current) {
      return;
    }

    let root: any;

    (async () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }

      const am5 = await import("@amcharts/amcharts5");
      const am5map = await import("@amcharts/amcharts5/map");
      const am5geodata_worldLow = await import(
        "@amcharts/amcharts5-geodata/worldLow"
      );
      const am5themes_Animated = await import(
        "@amcharts/amcharts5/themes/Animated"
      );

    if (chartDiv.current) {
      root = am5.Root.new(chartDiv.current);
      root.setThemes([am5themes_Animated.default.new(root)]);
    }

      let chart = root.container.children.push(
        am5map.MapChart.new(root, {
          projection: am5map.geoMercator(),
          homeZoomLevel: 1.2,
          homeGeoPoint: { longitude: 0, latitude: 0 },
        })
      );

      let polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow.default,
          exclude: ["AQ"],
          valueField: "value",
          calculateAggregates: true,
        })
      );

      const isDark = theme === 'dark';

      const processedData = data
        ?.map((item: any) => ({
          id: item.id,
          name: countryCodeMapping[item.id] || item.id,
          value: item.value || 0,
          unique_visitors: item.unique_visitors || 0,
          returning_visitors: item.returning_visitors || 0,
        }))
        .filter((item: any) => item.value > 0 && item.id);
      polygonSeries.data.setAll(processedData || []);

      polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}:\nTotal Visitors: {value}\nUnique Visitors: {unique_visitors}\nReturning Visitors: {returning_visitors}",
        interactive: true,
        fill: isDark ? am5.color(0x252d3d) : am5.color(0xeeeeee),
        stroke: isDark ? am5.color(0x374151) : am5.color(0xbbbbbb),
        strokeWidth: 0.5,
      });

      polygonSeries.mapPolygons.template.states.create("hover", {
        fill: am5.color(0x3b82f6),
      });

      polygonSeries.set("heatRules", [
        {
          target: polygonSeries.mapPolygons.template,
          key: "fill",
          min: am5.color(0x3b82f6),
          max: am5.color(0x10b981),
          dataField: "value",
          logarithmic: false,
        },
        {
            target: polygonSeries.mapPolygons.template,
            key: "fillOpacity",
            min: 0.5,
            max: 0.5,
            dataField: "value",
            logarithmic: false,
        }
      ]);

      chart.children.push(am5map.ZoomControl.new(root, {}));

      chartRef.current = root;
    })();

    return () => {
      chartRef.current?.dispose();
    };
  }, [theme, data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Global Visitor Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartDiv} style={{ width: "100%", height: "600px" }}></div>
      </CardContent>
    </Card>
  );
}

function DeviceAnalyticsChart({ data }: { data: any }) {
    const chartData = {
        labels: data?.map((d: any) => d.device_type) || [],
        datasets: [
            {
                data: data?.map((d: any) => d.count) || [],
                backgroundColor: ['rgba(59, 130, 246, 0.5)', 'rgba(16, 185, 129, 0.5)', 'rgba(245, 158, 11, 0.5)', 'rgba(239, 68, 68, 0.5)', 'rgba(139, 92, 246, 0.5)', 'rgba(236, 72, 153, 0.5)'],
                borderColor: '#1a1f2e',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: { color: '#e6e8eb', padding: 20, usePointStyle: true },
            },
        },
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5" /> Device Analytics</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <Doughnut data={chartData} options={options} />
      </CardContent>
    </Card>
  );
}

function BrowserDistributionChart({ data }: { data: any }) {
    const chartData = {
        labels: data?.map((d: any) => d.browser) || [],
        datasets: [
            {
                data: data?.map((d: any) => d.count) || [],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { display: false } },
            x: { ticks: { color: '#9ca3af' }, grid: { display: false } },
        },
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Browser Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
}


export function AnalyticsChartsGrid({ chartsData }: { chartsData: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <DeviceAnalyticsChart data={chartsData?.by_device} />
      <BrowserDistributionChart data={chartsData?.by_browser} />
    </div>
  );
}

export function CityDistributionChart({ data }: { data: any }) {
    const chartData = {
        labels: data?.map((d: any) => d.city) || [],
        datasets: [
            {
                data: data?.map((d: any) => d.count) || [],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderRadius: 4,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { display: false } },
            x: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { display: false } },
        },
        barPercentage: 0.6,
        categoryPercentage: 0.8,
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" /> City Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
}

export function TopPagesChart({ data }: { data: any }) {
    const chartData = {
        labels: data?.map((d: any) => d.page_visited) || [],
        datasets: [
            {
                data: data?.map((d: any) => d.count) || [],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderRadius: 4,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                anchor: 'end' as const,
                align: 'end' as const,
                formatter: (value: any) => {
                    return value;
                },
                color: '#e6e8eb',
            },
        },
        scales: {
            y: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { display: false } },
            x: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { display: false } },
        },
        barPercentage: 0.6,
        categoryPercentage: 0.8,
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Top Pages</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <Bar data={chartData} options={options} />
      </CardContent>
    </Card>
  );
}
