<?php 
    class CommonBLL
    {
        public function GetDepartamentos()
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetDepartamentos();
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }

        public function GetAnios()
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetAnios();
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }

        public function GetInstituciones()
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetInstituciones();
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }

        public function GetPyramidChartDataByYearPeriodUniversityCode($data)
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetPyramidChartDataByYearPeriodUniversityCode($data);
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }

        public function GetStackedChartDataByYearPeriodUniversityCode($data)
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetStackedChartDataByYearPeriodUniversityCode($data);
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }
        
        public function GetPieChartDataByYearDepartmentPeriodCode($data)
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetPieChartDataByYearDepartmentPeriodCode($data);
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }

        public function GetMatrixVariationData()
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetMatrixVariationData();
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }

        public function CleanDataBase(){
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->CleanDataBase();
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }

        public function GetProgramas()
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetProgramas();
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }

        public function GetMunicipios()
        {
            $responseDTO = new ResponseDTO();
	
            try 
            {
                $commonDAL = new CommonDAL();
                $responseDTO = $commonDAL->GetMunicipios();
            } 
            catch (Throwable $e) 
            {
                $responseDTO->SetErrorAndStackTrace("Ocurrió un problema obteniendo los datos", $e->getMessage());		
            }
            
            return $responseDTO;
        }
    }
?>