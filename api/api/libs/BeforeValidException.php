<?php

namespace Firebase\JWT;
class BeforeValidException 
{
    private $payload;

    public function setPayload($payload)
    {
        $this->payload = $payload;
    }

    public function getPayload()
    {
        return $this->payload;
    }
}
