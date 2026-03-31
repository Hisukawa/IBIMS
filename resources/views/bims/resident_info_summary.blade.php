<!DOCTYPE html>
<html>
<head>
    <title>Resident Information Sheet - {{ $barangayName ?? 'N/A' }}</title>
    <style>
        @page {
            size: A4;
            margin: 10mm;
        }

        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 10px;
            color: #111;
            margin: 0;
            line-height: 1.25;
        }

        .page-wrapper {
            width: 100%;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        /* HEADER */
        .header-table {
            margin-bottom: 8px;
        }

        .header-table td {
            vertical-align: middle;
            padding: 0;
        }

        .logo-cell {
            width: 17%;
            text-align: center;
        }

        .logo {
            width: 78px;
            height: 78px;
            display: block;
            margin: 0 auto;
        }

        .logo-placeholder {
            width: 78px;
            height: 78px;
            border: 1px solid #777;
            text-align: center;
            line-height: 78px;
            font-size: 7px;
            color: #666;
            margin: 0 auto;
        }

        .main-header-text {
            width: 66%;
            text-align: center;
            line-height: 1.3;
        }

        .main-header-text .line {
            font-size: 11px;
            font-weight: bold;
        }

        .main-header-text .title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 4px;
            letter-spacing: 0.5px;
        }

        .main-header-text .subtitle {
            font-size: 9px;
            margin-top: 2px;
        }

        .header-divider {
            border-top: 2px solid #000;
            border-bottom: 1px solid #000;
            height: 3px;
            margin: 8px 0 10px 0;
        }

        /* MAIN TWO-COLUMN LAYOUT */
        .main-layout td {
            vertical-align: top;
        }

        .left-column {
            width: 72%;
            padding-right: 8px;
        }

        .right-column {
            width: 28%;
        }

        /* PHOTO CARD */
        .photo-card {
            border: 1px solid #333;
            padding: 8px;
            text-align: center;
            margin-bottom: 10px;
        }

        .photo-card-title {
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #999;
            padding-bottom: 4px;
            margin-bottom: 6px;
        }

        .photo-container {
            width: 100%;
            height: 210px;
            overflow: hidden;
            text-align: center;
        }

        .photo-container img {
            max-width: 100%;
            max-height: 200px;
            display: block;
            margin: 0 auto;
        }

        .photo-placeholder {
            height: 200px;
            border: 1px dashed #999;
            line-height: 200px;
            font-size: 10px;
            color: #777;
        }

        .resident-image-label {
            margin-top: 6px;
            font-size: 9px;
            color: #444;
        }

        /* QUICK SUMMARY BOX */
        .summary-box {
            border: 1px solid #333;
            padding: 8px;
            margin-bottom: 10px;
        }

        .summary-title {
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 6px;
            border-bottom: 1px solid #999;
            padding-bottom: 4px;
        }

        .summary-box p {
            margin: 4px 0;
            font-size: 9.5px;
        }

        /* SECTION TABLES */
        .section-block {
            margin-bottom: 10px;
        }

        .section-title {
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
            background: #d9d9d9;
            border: 1px solid #333;
            border-bottom: none;
            padding: 5px 6px;
            letter-spacing: 0.2px;
        }

        .info-table th,
        .info-table td {
            border: 1px solid #333;
            padding: 5px 6px;
            vertical-align: top;
            word-wrap: break-word;
        }

        .info-table th {
            width: 34%;
            background: #f3f3f3;
            text-align: left;
            font-size: 9.5px;
            font-weight: bold;
        }

        .info-table td {
            width: 66%;
            font-size: 9.5px;
        }

        /* FOOTER / PRIVACY */
        .privacy-note {
            margin-top: 8px;
            border: 1px solid #333;
            padding: 7px 8px;
            font-size: 8.5px;
            text-align: justify;
            line-height: 1.3;
        }

        .footer-note {
            margin-top: 6px;
            font-size: 8.5px;
            text-align: left;
        }
    </style>
</head>
<body>
<div class="page-wrapper">

    <!-- HEADER -->
    <table class="header-table">
        <tr>
            <td class="logo-cell">
                @if(file_exists(public_path('images/city-of-ilagan.png')))
                    <img src="{{ public_path('images/city-of-ilagan.png') }}" class="logo">
                @else
                    <div class="logo-placeholder">City Logo</div>
                @endif
            </td>

            <td class="main-header-text">
                <div class="line">Republic of the Philippines</div>
                <div class="line">City of Ilagan</div>
                <div class="line">Province of Isabela</div>
                <div class="line">Barangay {{ $barangayName ?? ($resident->barangay->name ?? 'N/A') }}</div>
                <div class="title">Resident Information Sheet</div>
                <div class="subtitle">Official Barangay Resident Record</div>
            </td>

            <td class="logo-cell">
                @if($barangayLogo && file_exists(public_path('storage/'.$barangayLogo)))
                    <img src="{{ public_path('storage/'.$barangayLogo) }}" class="logo">
                @else
                    <div class="logo-placeholder">Brgy Logo</div>
                @endif
            </td>
        </tr>
    </table>

    <div class="header-divider"></div>

    <!-- MAIN CONTENT -->
    <table class="main-layout">
        <tr>
            <td class="left-column">

                <div class="section-block">
                    <div class="section-title">Personal Information</div>
                    <table class="info-table">
                        <tr>
                            <th>Full Name</th>
                            <td>{{ $resident->lastname }}, {{ $resident->firstname }} {{ $resident->middlename }} {{ $resident->suffix ?? '' }}</td>
                        </tr>
                        <tr>
                            <th>Birthdate</th>
                            <td>{{ $resident->birthdate ? \Carbon\Carbon::parse($resident->birthdate)->format('F d, Y') : 'N/A' }}</td>
                        </tr>
                        <tr>
                            <th>Age</th>
                            <td>{{ $resident->birthdate ? \Carbon\Carbon::parse($resident->birthdate)->age : 'N/A' }}</td>
                        </tr>
                        <tr>
                            <th>Birthplace</th>
                            <td>{{ $resident->birthplace ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <th>Sex</th>
                            <td>{{ ucfirst($resident->sex ?? $resident->gender ?? 'N/A') }}</td>
                        </tr>
                        <tr>
                            <th>Civil Status</th>
                            <td>{{ ucfirst($resident->civil_status ?? 'N/A') }}</td>
                        </tr>
                        <tr>
                            <th>Citizenship</th>
                            <td>{{ $resident->citizenship ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <th>Religion</th>
                            <td>{{ $resident->religion ?? 'N/A' }}</td>
                        </tr>
                    </table>
                </div>

                <div class="section-block">
                    <div class="section-title">Address and Contact Information</div>
                    <table class="info-table">
                        <tr>
                            <th>Household No.</th>
                            <td>{{ optional($resident->latestHousehold)->house_number ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <th>Purok No.</th>
                            <td>{{ $resident->purok_number ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <th>Street</th>
                            <td>{{ optional($resident->street)->street_name ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <th>Residency Since</th>
                            <td>{{ $resident->residency_date ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <th>Contact Number</th>
                            <td>{{ $resident->contact_number ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <th>Email Address</th>
                            <td>{{ $resident->email ?? 'N/A' }}</td>
                        </tr>
                    </table>
                </div>

                <div class="section-block">
                    <div class="section-title">Resident Profile Summary</div>
                    <table class="info-table">
                        <tr>
                            <th>Employment Status</th>
                            <td>{{ ucfirst($resident->employment_status ?? 'N/A') }}</td>
                        </tr>
                        <tr>
                            <th>Occupation</th>
                            <td>{{ optional($resident->latestOccupation)->occupation ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <th>Highest Education</th>
                            <td>{{ optional($resident->latestEducation)->level ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <th>Registered Voter</th>
                            <td>{{ $resident->registered_voter ? 'Yes' : 'No' }}</td>
                        </tr>
                        <tr>
                            <th>4Ps Beneficiary</th>
                            <td>{{ optional($resident->socialwelfareprofile)->is_4ps_beneficiary ? 'Yes' : 'No' }}</td>
                        </tr>
                        <tr>
                            <th>PWD</th>
                            <td>{{ $resident->is_pwd ? 'Yes' : 'No' }}</td>
                        </tr>
                        <tr>
                            <th>Senior Citizen</th>
                            <td>{{ $resident->seniorcitizen ? 'Yes' : 'No' }}</td>
                        </tr>
                    </table>
                </div>

            </td>

            <td class="right-column">
                <div class="photo-card">
                    <div class="photo-card-title">Resident Photo</div>
                    <div class="photo-container">
                        @if($resident->resident_picture_path && file_exists(public_path('storage/'.$resident->resident_picture_path)))
                            <img src="{{ public_path('storage/'.$resident->resident_picture_path) }}">
                        @else
                            <div class="photo-placeholder">Photo Not Available</div>
                        @endif
                    </div>
                    <div class="resident-image-label">Attached image on file</div>
                </div>

                <div class="summary-box">
                    <div class="summary-title">Quick Reference</div>
                    <p><strong>Barangay:</strong> {{ $barangayName ?? ($resident->barangay->name ?? 'N/A') }}</p>
                    <p><strong>Resident ID:</strong> {{ $resident->id ?? 'N/A' }}</p>
                    <p><strong>Status:</strong> Active Resident Record</p>
                    <p><strong>Date Printed:</strong> {{ now()->format('F d, Y') }}</p>
                </div>
            </td>
        </tr>
    </table>

    <div class="privacy-note">
        This Resident Information Sheet is issued for official barangay record-keeping, planning, profiling, and public service delivery. All information herein shall be handled in accordance with applicable privacy and confidentiality policies of the barangay and existing laws.
    </div>

    <div class="footer-note">
        Printed on: {{ now()->format('F d, Y — h:i A') }}
    </div>

</div>
</body>
</html>
