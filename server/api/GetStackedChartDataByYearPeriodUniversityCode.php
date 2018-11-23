<?php 
    include_once("../Libraries/commonLibraries.php");

    $responseDTO = new ResponseDTO();
	
	try 
	{
		$requestJson = file_get_contents("php://input");
		if(!$requestJson){
			return $responseDTO;
		}

        $requestData = json_decode($requestJson);

        $commonBLL = new CommonBLL();
        $responseDTO = $commonBLL->GetStackedChartDataByYearPeriodUniversityCode($requestData);
	} 
	catch (Throwable $e) 
	{
		$responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
	}
    
	echo json_encode($responseDTO);
?>